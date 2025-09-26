import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

// Check if we're in a build context
const isBuilding = process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY;

let stripeInstance: Stripe | null = null;

// Create Stripe client only when needed (not during build)
const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (isBuilding) {
      // Return mock functions during build
      return () => Promise.resolve({ mock: 'build-time-data' });
    }
    
    if (!stripeInstance) {
      stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2025-08-27.basil',
      });
    }
    
    return (stripeInstance as any)[prop];
  }
});

// Supabase admin client for webhook operations
const supabaseAdmin = supabase;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .update({ 
            status: 'completed',
            subscription_id: session.subscription as string || null
          } as never)
          .eq('stripe_session_id', session.id);

        if (orderError) {
          console.error('Failed to update order:', orderError);
        }
        
        // Grant access to kit
        const kitId = session.metadata?.kit_id;
        if (kitId) {
          const { error: kitError } = await supabaseAdmin
            .from('kits')
            .update({ has_access: true } as never)
            .eq('id', kitId);

          if (kitError) {
            console.error('Failed to grant kit access:', kitError);
          }
        }
        
        // Update user plan status
        const userId = session.client_reference_id;
        if (userId && userId !== 'temp-user') {
          const planType = session.metadata?.plan_type === 'subscription' ? 'paid_subscription' : 'paid_oneoff';
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ plan_status: planType } as never)
            .eq('id', userId);

          if (profileError) {
            console.error('Failed to update profile:', profileError);
          }
        }
        break;
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as any;
        
        // Track subscription payments and check if we've reached 37 payments
        if (invoice.subscription) {
          // Get all successful invoices for this subscription
          const invoices = await stripe.invoices.list({
            subscription: invoice.subscription as string,
            status: 'paid',
            limit: 100,
          });

          // If we've reached 37 payments, cancel the subscription
          if (invoices.data.length >= 37) {
            await stripe.subscriptions.cancel(invoice.subscription as string);
            console.log(`Subscription ${invoice.subscription} cancelled after 37 payments`);
          }
        }
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object as any;
        
        // Update user plan status when subscription is cancelled
        const { data: order } = await supabaseAdmin
          .from('orders')
          .select('user_id')
          .eq('subscription_id', subscription.id)
          .single();

        const orderData = order as any;
        if (orderData?.user_id) {
          await supabaseAdmin
            .from('profiles')
            .update({ plan_status: 'free' } as never)
            .eq('id', orderData.user_id);
        }
        break;

      case 'invoice.payment_failed':
        // Handle failed subscription payments
        const failedInvoice = event.data.object as any;
        console.log('Payment failed for subscription:', failedInvoice.subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
