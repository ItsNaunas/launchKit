import { NextRequest, NextResponse } from 'next/server';
import { IntakeSchema } from '@/lib/schemas';
import { supabase } from '@/lib/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input data
    const validatedData = IntakeSchema.parse(body);

    // Get authenticated user
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Serialize arrays to JSON strings for storage
    const kitData = {
      user_id: user.id,
      title: validatedData.idea_title,
      has_access: false, // Will be set to true after payment
      one_liner: validatedData.one_liner,
      category: validatedData.category,
      target_audience: validatedData.target_audience,
      primary_goal: validatedData.primary_goal,
      budget_band: validatedData.budget_band,
      time_horizon: validatedData.time_horizon,
      challenges: JSON.stringify(validatedData.top_3_challenges),
      geography: validatedData.geography,
      brand_vibe: validatedData.brand_vibe,
      sales_channel_focus: validatedData.sales_channel_focus,
      business_model: validatedData.business_model || null,
      fulfilment: validatedData.fulfilment || null,
      pricing_idea: validatedData.pricing_idea || null,
      competitor_links: JSON.stringify(validatedData.competitor_links || []),
      inspiration_links: JSON.stringify(validatedData.inspiration_links || []),
      content_strengths: JSON.stringify(validatedData.content_strengths || []),
      constraints: validatedData.constraints || null,
      revenue_target_30d: validatedData.revenue_target_30d || null,
    };

    // Insert into database
    const { data: kit, error } = await supabase
      .from('kits')
      .insert(kitData as never)
      .select('id')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create kit' },
        { status: 500 }
      );
    }

    // Type assertion for kit after null check
    const kitResult = kit as any;
    return NextResponse.json({ kitId: kitResult.id });
  } catch (error) {
    console.error('API error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
