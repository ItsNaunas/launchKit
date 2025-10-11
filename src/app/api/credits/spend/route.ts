import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const SpendSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().positive(),
  description: z.string(),
  referenceId: z.string().uuid().optional(),
});

// POST /api/credits/spend - Spend credits
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, description, referenceId } = SpendSchema.parse(body);

    // Call the spend_credits function
    const { data, error } = await supabase.rpc('spend_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
      p_reference_id: referenceId || null,
    });

    if (error) {
      console.error('Error spending credits:', error);
      return NextResponse.json(
        { error: 'Failed to spend credits' },
        { status: 500 }
      );
    }

    // data will be true if successful, false if insufficient balance
    if (!data) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    // Fetch updated balance
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      balance: credits?.balance ?? 0,
    });
  } catch (error) {
    console.error('Error in credits spend:', error);
    
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

