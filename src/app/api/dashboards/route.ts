import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const supabaseAdmin = supabase;

// GET /api/dashboards - List all dashboards for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Fetch all kits (dashboards) for the user
    const { data: dashboards, error } = await supabaseAdmin
      .from('kits')
      .select('id, title, one_liner, created_at, has_access, checkout_completed_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dashboards:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboards' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      dashboards: dashboards || [],
      count: dashboards?.length || 0
    });
  } catch (error) {
    console.error('Error in dashboards GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

const CreateDashboardSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  one_liner: z.string().max(500).optional(),
  category: z.enum(['service', 'product', 'local', 'content', 'e-com', 'saas']).optional(),
});

// POST /api/dashboards - Create a new dashboard (costs 750 credits)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, one_liner, category } = CreateDashboardSchema.parse(body);

    const DASHBOARD_COST = 750; // Credits required to create a dashboard

    // Check if user has enough credits
    const { data: userCredits } = await supabaseAdmin
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle() as { data: { balance: number } | null; error: any };

    const currentBalance = userCredits?.balance ?? 0;

    if (currentBalance < DASHBOARD_COST) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          required: DASHBOARD_COST,
          current: currentBalance,
          needed: DASHBOARD_COST - currentBalance
        },
        { status: 400 }
      );
    }

    // Create the new dashboard (kit)
    const { data: newKit, error: kitError } = await supabaseAdmin
      .from('kits')
      .insert({
        user_id: userId,
        title,
        one_liner: one_liner || title,
        category: category || 'service',
        has_access: true, // Grant immediate access since they paid with credits
        checkout_completed_at: new Date().toISOString(),
      } as any)
      .select()
      .single();

    if (kitError || !newKit) {
      console.error('Error creating dashboard:', kitError);
      return NextResponse.json(
        { error: 'Failed to create dashboard' },
        { status: 500 }
      );
    }

    // Type assertion for newKit
    const kit = newKit as any;

    // Spend credits
    const { data: spendSuccess, error: spendError } = await supabaseAdmin.rpc('spend_credits', {
      p_user_id: userId,
      p_amount: DASHBOARD_COST,
      p_description: `Created new dashboard: ${title}`,
      p_reference_id: kit.id,
    } as any);

    if (spendError || !spendSuccess) {
      // Rollback: delete the kit
      await supabaseAdmin
        .from('kits')
        .delete()
        .eq('id', kit.id);

      console.error('Error spending credits:', spendError);
      return NextResponse.json(
        { error: 'Failed to spend credits' },
        { status: 500 }
      );
    }

    // Fetch updated balance
    const { data: updatedCredits } = await supabaseAdmin
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle() as { data: { balance: number } | null; error: any };

    return NextResponse.json({
      success: true,
      dashboard: kit,
      creditsSpent: DASHBOARD_COST,
      newBalance: updatedCredits?.balance ?? 0,
    });
  } catch (error) {
    console.error('Error in dashboards POST:', error);
    
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

