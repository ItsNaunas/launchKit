import { NextRequest, NextResponse } from 'next/server';
import { IntakeSchema, MiniIntakeSchema } from '@/lib/schemas';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is mini intake data or full intake data
    let validatedData;
    let kitData;
    
    try {
      // Try to validate as mini intake first
      validatedData = MiniIntakeSchema.parse(body);
      
      // Convert mini intake to kit data
      const tempUserId = 'temp-user-' + Date.now();
      
      kitData = {
        user_id: tempUserId,
        title: validatedData.business_idea.substring(0, 80), // Truncate to fit title field
        has_access: false,
        one_liner: validatedData.business_idea,
        category: 'service', // Default category
        target_audience: 'General audience', // Default
        primary_goal: 'launch', // Default
        budget_band: validatedData.budget === 'shoestring' ? '<100' : 
                    validatedData.budget === 'moderate' ? '100-500' : '500-2000',
        time_horizon: '30d', // Default
        challenges: JSON.stringify(validatedData.challenges),
        geography: 'UK', // Default
        brand_vibe: 'accessible', // Default
        sales_channel_focus: 'Mixed', // Default
        business_model: null,
        fulfilment: null,
        pricing_idea: null,
        competitor_links: JSON.stringify([]),
        inspiration_links: JSON.stringify([]),
        content_strengths: JSON.stringify([]),
        constraints: null,
        revenue_target_30d: null,
      };
    } catch {
      // If mini intake fails, try full intake schema
      validatedData = IntakeSchema.parse(body);
      
      const tempUserId = 'temp-user-' + Date.now();
      
      kitData = {
        user_id: tempUserId,
        title: validatedData.idea_title,
        has_access: false,
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
    }

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
