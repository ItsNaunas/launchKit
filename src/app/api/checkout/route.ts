import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

const CheckoutSchema = z.object({
  kitId: z.string().uuid(),
  planType: z.enum(['oneoff', 'subscription']),
  userId: z.string().uuid().optional(), // Will be required when auth is implemented
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kitId, planType, userId } = CheckoutSchema.parse(body);

    // Verify kit exists
    const { data: kit, error: kitError } = await supabase
      .from('kits')
      .select('id, title, user_id')
      .eq('id', kitId)
      .single();

    if (kitError || !kit) {
      return NextResponse.json(
        { error: 'Kit not found' },
        { status: 404 }
      );
    }

    // Type assertion for kit after null check
    const kitData = kit as { id: string; title: string; user_id: string };

    // Create Stripe customer (in production, check if customer already exists)
    const customer = await stripe.customers.create({
      metadata: {
        kit_id: kitId,
        user_id: userId || 'temp-user',
      },
    });

    // Configure checkout session based on plan type
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customer.id,
      client_reference_id: userId || 'temp-user',
      metadata: {
        kit_id: kitId,
        plan_type: planType,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/kit/${kitId}/preview?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/kit/${kitId}/preview?cancelled=true`,
      automatic_tax: { enabled: false },
    };

    if (planType === 'oneoff') {
      // One-time payment
      sessionConfig.mode = 'payment';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `LaunchKit AI: ${kitData.title}`,
              description: 'Complete business launch strategy with AI-generated content',
            },
            unit_amount: 3700, // £37.00 in pence
          },
          quantity: 1,
        },
      ];
    } else {
      // Subscription payment (£1/day for 37 days)
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `LaunchKit AI Daily Plan: ${kitData.title}`,
              description: 'Pay £1/day for 37 days - complete business launch strategy',
            },
            unit_amount: 100, // £1.00 in pence
            recurring: {
              interval: 'day',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Create order record
    const orderData = {
      user_id: userId || 'temp-user',
      kit_id: kitId,
      stripe_session_id: session.id,
      amount: planType === 'oneoff' ? 3700 : 100,
      currency: 'gbp',
      status: 'pending' as const,
      price_id: null,
      subscription_id: null,
    };
    
    const { error: orderError } = await supabase
      .from('orders')
      .insert(orderData as never);

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
