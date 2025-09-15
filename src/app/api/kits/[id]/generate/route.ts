import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const GenerateSchema = z.object({
  type: z.enum(['business_case', 'content_strategy']),
  regenerate: z.boolean().default(false),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { type, regenerate } = GenerateSchema.parse(body);
    const kitId = params.id;

    // Get kit data with all intake information
    const { data: kit, error: kitError } = await supabase
      .from('kits')
      .select('*')
      .eq('id', kitId)
      .single();

    if (kitError || !kit) {
      return NextResponse.json(
        { error: 'Kit not found' },
        { status: 404 }
      );
    }

    // Check if user has access to the kit
    if (!kit.has_access) {
      return NextResponse.json(
        { error: 'Access denied. Please complete payment to generate content.' },
        { status: 403 }
      );
    }

    // Check existing output and regeneration limit
    const { data: existingOutput, error: outputError } = await supabase
      .from('outputs')
      .select('*')
      .eq('kit_id', kitId)
      .eq('type', type)
      .single();

    if (regenerate) {
      if (!existingOutput) {
        return NextResponse.json(
          { error: 'No existing content to regenerate' },
          { status: 400 }
        );
      }

      if (existingOutput.regen_count >= 3) {
        return NextResponse.json(
          { error: 'Regeneration limit reached (3 maximum). Contact us for additional regenerations.' },
          { status: 429 }
        );
      }
    } else if (existingOutput) {
      return NextResponse.json(
        { error: 'Content already exists. Use regenerate=true to create new version.' },
        { status: 409 }
      );
    }

    // Prepare intake data for OpenAI
    const intakeData = {
      idea_title: kit.title,
      one_liner: kit.one_liner,
      category: kit.category,
      target_audience: kit.target_audience,
      primary_goal: kit.primary_goal,
      budget_band: kit.budget_band,
      time_horizon: kit.time_horizon,
      top_3_challenges: kit.challenges ? JSON.parse(kit.challenges) : [],
      geography: kit.geography,
      brand_vibe: kit.brand_vibe,
      sales_channel_focus: kit.sales_channel_focus,
      business_model: kit.business_model,
      fulfilment: kit.fulfilment,
      pricing_idea: kit.pricing_idea,
      competitor_links: kit.competitor_links ? JSON.parse(kit.competitor_links) : [],
      inspiration_links: kit.inspiration_links ? JSON.parse(kit.inspiration_links) : [],
      content_strengths: kit.content_strengths ? JSON.parse(kit.content_strengths) : [],
      constraints: kit.constraints,
      revenue_target_30d: kit.revenue_target_30d,
    };

    // Generate content based on type
    let generatedContent;
    
    if (type === 'business_case') {
      generatedContent = await generateBusinessCase(intakeData);
    } else {
      generatedContent = await generateContentStrategy(intakeData);
    }

    // Save or update the output
    if (regenerate && existingOutput) {
      const { data: updatedOutput, error: updateError } = await supabase
        .from('outputs')
        .update({
          content: JSON.stringify(generatedContent),
          regen_count: existingOutput.regen_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingOutput.id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update output:', updateError);
        return NextResponse.json(
          { error: 'Failed to save generated content' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        content: generatedContent,
        regens_remaining: 3 - updatedOutput.regen_count,
      });
    } else {
      const { data: newOutput, error: insertError } = await supabase
        .from('outputs')
        .insert({
          kit_id: kitId,
          type,
          content: JSON.stringify(generatedContent),
          regen_count: 0,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to insert output:', insertError);
        return NextResponse.json(
          { error: 'Failed to save generated content' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        content: generatedContent,
        regens_remaining: 3,
      });
    }

  } catch (error) {
    console.error('Generation error:', error);
    
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

async function generateBusinessCase(intakeData: any) {
  const prompt = `You are a business strategy expert. Based on the following business idea details, create a comprehensive business case analysis.

Business Idea Details:
${JSON.stringify(intakeData, null, 2)}

Please provide a detailed business case analysis in the following JSON format:
{
  "positioning": "Clear positioning statement for the business",
  "value_prop": "Compelling value proposition",
  "audience_summary": "Detailed target audience analysis",
  "offer_bullets": ["3-5 key offer points"],
  "brand_identity": {
    "vibe": "Brand personality that matches their chosen vibe",
    "keywords": ["5-8 brand keywords"]
  },
  "pricing": {
    "idea": "Pricing strategy recommendation",
    "alternatives": ["2-3 alternative pricing approaches"]
  },
  "name_ideas": ["5 creative business name suggestions"],
  "taglines": ["5 compelling tagline options"],
  "risks": ["3-4 key risks to consider"],
  "first_3_steps": ["3 specific, actionable next steps"]
}

Focus on being specific to their industry, target audience, and goals. Make all recommendations actionable and tailored to their budget and timeline.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  return JSON.parse(content);
}

async function generateContentStrategy(intakeData: any) {
  const prompt = `You are a content marketing expert. Based on the following business idea details, create a comprehensive 30-day content strategy.

Business Idea Details:
${JSON.stringify(intakeData, null, 2)}

Please provide a detailed content strategy in the following JSON format:
{
  "channels": ["Primary channels based on their sales_channel_focus"],
  "cadence": {
    "channel_name": "posting frequency (e.g., '3/week', 'daily')"
  },
  "tone": "Content tone and voice description",
  "hooks_7": [
    "7 proven hook templates specific to their niche"
  ],
  "thirty_day_themes": [
    "Week 1: Theme and focus",
    "Week 2: Theme and focus", 
    "Week 3: Theme and focus",
    "Week 4: Theme and focus"
  ]
}

Make the strategy specific to their chosen sales channels, brand vibe, and target audience. Include practical, actionable content ideas they can start implementing immediately.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  return JSON.parse(content);
}
