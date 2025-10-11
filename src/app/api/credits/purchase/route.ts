import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Check if we're in a build context
const isBuilding = process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY;

let stripeInstance: Stripe | null = null;

// Create Stripe client only when needed (not during build)
const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (isBuilding) {
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

const PurchaseSchema = z.object({
  userId: z.string().uuid(),
  package: z.enum(['500', '1000']),
});

// POST /api/credits/purchase - Create Stripe checkout for credit purchase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, package: packageType } = PurchaseSchema.parse(body);

    // Define credit packages
    const packages = {
      '500': {
        credits: 500,
        price: 699, // £6.99 in pence
        name: '500 Credits Pack',
      },
      '1000': {
        credits: 1000,
        price: 1299, // £12.99 in pence
        name: '1000 Credits Pack',
      },
    };

    const selectedPackage = packages[packageType];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: selectedPackage.name,
              description: `Purchase ${selectedPackage.credits} credits for creating new dashboards`,
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
        credits_amount: selectedPackage.credits.toString(),
        package_type: packageType,
        purchase_type: 'credits',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits_purchase=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?cancelled=true`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Credit purchase error:', error);
    
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

