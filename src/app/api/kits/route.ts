import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { simpleIntakeSchema } from '@/lib/validation';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = simpleIntakeSchema.parse(body);
    
    const tempUserId = crypto.randomUUID();
    
    // Create a temporary profile first
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: tempUserId,
        email: `temp-${tempUserId}@example.com`,
        plan_status: 'free'
      } as never);
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }
    
    const kitData = {
      user_id: tempUserId,
      title: validatedData.business_idea.substring(0, 80), // Truncate to fit title field
      has_access: true, // Grant access immediately for testing
      one_liner: validatedData.business_idea,
      category: 'service', // Default category
      target_audience: validatedData.target_audience,
      primary_goal: 'launch', // Default
      budget_band: 'none', // Default
      time_horizon: '30d', // Default
      challenges: JSON.stringify([validatedData.main_challenge]),
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

    // Insert into database using admin client to bypass RLS
    const { data: kit, error } = await supabaseAdmin
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
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid form data', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create kit. Please try again.' },
      { status: 500 }
    );
  }
}
