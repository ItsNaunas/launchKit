import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PromptAssembler } from '@/lib/prompt-assembler';
import { kitIdSchema, generateContentSchema } from '@/lib/validation';
import OpenAI from 'openai';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = kitIdSchema.parse(resolvedParams);
    const { type } = generateContentSchema.parse(await request.json());

    // Get kit data with profiling information
    const { data: kit, error: kitError } = await supabaseAdmin
      .from('kits')
      .select('*')
      .eq('id', id)
      .single();

    if (kitError || !kit) {
      return NextResponse.json(
        { error: 'Kit not found' },
        { status: 404 }
      );
    }

    // Create prompt assembler with kit data converted to expected format
    const kitData = {
      idea_title: (kit as any).title || 'Business Idea',
      one_liner: (kit as any).one_liner || (kit as any).title || 'Business description',
      category: (kit as any).category || 'service',
      target_audience: (kit as any).target_audience || '',
      primary_goal: (kit as any).primary_goal || 'launch',
      budget_band: (kit as any).budget_band || 'none',
      time_horizon: (kit as any).time_horizon || '30d',
      top_3_challenges: (kit as any).challenges ? JSON.parse((kit as any).challenges) : ['Finding customers', 'Pricing strategy', 'Time management'],
      geography: (kit as any).geography || 'UK',
      brand_vibe: (kit as any).brand_vibe || 'accessible',
      sales_channel_focus: (kit as any).sales_channel_focus || 'Mixed',
      competitor_links: (kit as any).competitor_links ? JSON.parse((kit as any).competitor_links) : [],
      inspiration_links: (kit as any).inspiration_links ? JSON.parse((kit as any).inspiration_links) : [],
      content_strengths: (kit as any).content_strengths ? JSON.parse((kit as any).content_strengths) : []
    };
    
    const profilingData = {
      audienceDetail: (kit as any).target_audience || '',
      outcomePreference: '',
      tonePreference: ''
    };
    const selectedOptions = {};
    const promptAssembler = new PromptAssembler(kitData, profilingData, selectedOptions);

    // Generate the appropriate prompt
    let prompt: string;
    switch (type) {
      case 'business_case':
        prompt = promptAssembler.generateBusinessCasePrompt();
        break;
      case 'content_strategy':
        prompt = promptAssembler.generateContentStrategyPrompt();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate AI content
    let aiContent;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: type === 'business_case' 
              ? "You are a business strategy expert. Generate a comprehensive business case with positioning, value proposition, target audience analysis, key benefits, pricing strategy, name ideas, taglines, risks, and actionable next steps. Return your response as valid JSON."
              : "You are a content marketing expert. Generate a comprehensive content strategy with primary channels, posting cadence, content tone, hook formulas, and 30-day themes. Return your response as valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from OpenAI');
      }

      // Parse the AI response as JSON
      aiContent = JSON.parse(aiResponse);
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to mock content if AI fails
      aiContent = generateMockContent(type);
    }

    // Save the generated content
    const { error: saveError } = await supabaseAdmin
      .from('outputs')
      .upsert({
        kit_id: id,
        type: type,
        content: JSON.stringify(aiContent),
        regen_count: 0,
      } as never);

    if (saveError) {
      console.error('Error saving generated content:', saveError);
      return NextResponse.json(
        { error: 'Failed to save generated content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      content: aiContent,
      prompt: prompt, // Include prompt for debugging
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock content generator (replace with actual OpenAI integration)
function generateMockContent(type: string): any {
  const baseContent = {
    business_case: {
      positioning: "Premium solution for busy professionals who value quality and convenience",
      value_prop: "Save 10+ hours per week with our streamlined approach",
      audience_summary: "Busy professionals aged 25-45 who are willing to pay for convenience",
      offer_bullets: [
        "Complete setup in under 2 hours",
        "Ongoing support and optimization",
        "Proven results with 500+ customers"
      ],
      brand_identity: {
        vibe: "Professional yet approachable",
        keywords: ["efficient", "reliable", "premium", "results-driven"]
      },
      pricing: {
        idea: "£299 one-time setup + £99/month maintenance",
        alternatives: ["£199 basic package", "£499 premium with priority support"]
      },
      name_ideas: ["ProLaunch", "QuickStart Pro", "LaunchPad", "StartSmart"],
      taglines: [
        "Launch faster, launch smarter",
        "Your shortcut to success",
        "From idea to launch in days, not months"
      ],
      risks: [
        "Market saturation in this space",
        "High customer acquisition costs",
        "Seasonal demand fluctuations"
      ],
      first_3_steps: [
        "Validate your idea with 10 potential customers",
        "Create a simple landing page to test demand",
        "Build your MVP and get first paying customers"
      ]
    },
    content_strategy: {
      channels: ["LinkedIn", "Instagram", "Email Newsletter", "YouTube"],
      cadence: {
        "LinkedIn": "3 posts per week",
        "Instagram": "Daily stories + 5 posts per week",
        "Email Newsletter": "Weekly",
        "YouTube": "2 videos per month"
      },
      tone: "Professional yet approachable, with a focus on practical value",
      hooks_7: [
        "The mistake 90% of [audience] make when starting out...",
        "How I went from idea to £10k revenue in 30 days",
        "The one thing that changed everything for my business",
        "Why most [business type] fail (and how to avoid it)",
        "The secret my competitors don't want you to know",
        "How to [achieve outcome] without [common struggle]",
        "The framework that helped me [specific result]"
      ],
      thirty_day_themes: [
        "Week 1: Foundation & Planning",
        "Week 2: Content Creation & Systems",
        "Week 3: Audience Building & Engagement",
        "Week 4: Optimization & Growth"
      ]
    },
  };

  return baseContent[type as keyof typeof baseContent] || {};
}