import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/credits - Get user's credit balance
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from auth session
    // For now, using query param for testing
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get credit balance
    const { data: credits, error } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle() as { data: { balance: number } | null; error: any };

    if (error) {
      console.error('Error fetching credits:', error);
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      );
    }

    // Return balance (0 if no record exists)
    const balance = credits?.balance ?? 0;

    return NextResponse.json({ 
      balance,
      userId 
    });
  } catch (error) {
    console.error('Error in credits GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

