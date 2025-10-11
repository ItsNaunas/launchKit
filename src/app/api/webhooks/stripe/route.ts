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
        
        // Check if this is a credit purchase
        if (session.metadata?.purchase_type === 'credits') {
          const userId = session.metadata.user_id;
          const creditsAmount = parseInt(session.metadata.credits_amount || '0');
          
          if (userId && creditsAmount > 0) {
            // Add credits to user account
            const { error: creditsError } = await supabaseAdmin.rpc('add_credits', {
              p_user_id: userId,
              p_amount: creditsAmount,
              p_type: 'purchase',
              p_description: `Purchased ${creditsAmount} credits`,
              p_reference_id: null,
            } as any);
            
            if (creditsError) {
              console.error('Failed to add credits:', creditsError);
            } else {
              console.log(`Added ${creditsAmount} credits to user ${userId}`);
            }
          }
          break;
        }
        
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
            .update({ 
              has_access: true,
              checkout_completed_at: new Date().toISOString()
            } as never)
            .eq('id', kitId);

          if (kitError) {
            console.error('Failed to grant kit access:', kitError);
          }
          
          // If hosting was included, set up the hosting subscription (starts in 2 months)
          const includeHosting = session.metadata?.include_hosting === 'true';
          if (includeHosting && session.customer) {
            try {
              // Calculate start date (2 months from now for free period)
              const twoMonthsFromNow = Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60); // 60 days in seconds
              
              // Create hosting subscription
              const hostingSubscription = await stripe.subscriptions.create({
                customer: session.customer as string,
                items: [{
                  price_data: {
                    currency: 'gbp',
                    product_data: {
                      name: 'Website Hosting',
                      description: 'Professional website hosting with CDN, SSL, and automatic backups',
                    },
                    unit_amount: 300, // £3.00 in pence
                    recurring: {
                      interval: 'month',
                    },
                  } as any,
                }],
                billing_cycle_anchor: twoMonthsFromNow,
                proration_behavior: 'none',
                metadata: {
                  kit_id: kitId,
                  type: 'hosting',
                },
              });
              
              // Update kit with hosting info
              await supabaseAdmin
                .from('kits')
                .update({ 
                  hosting_enabled: true,
                  hosting_subscription_id: hostingSubscription.id
                } as never)
                .eq('id', kitId);
                
              console.log('Hosting subscription created:', hostingSubscription.id);
            } catch (hostingError) {
              console.error('Error creating hosting subscription:', hostingError);
              // Don't fail the whole checkout if hosting fails
            }
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
