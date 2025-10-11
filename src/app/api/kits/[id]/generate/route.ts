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
    const body = await request.json();
    const { type, regenerate = false } = body;

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

    // Check checkout status
    const hasCheckoutAccess = (kit as any).has_access || (kit as any).checkout_completed_at;

    // Check existing output and regeneration limits
    const { data: existingOutput } = await supabaseAdmin
      .from('outputs')
      .select('*')
      .eq('kit_id', id)
      .eq('type', type)
      .single();

    // Regeneration logic based on spec:
    // - Business Case: 1 pre-checkout, unlimited post
    // - Content Strategy: 1 pre-checkout, unlimited post
    // - Website: unlimited (but doesn't use this route)
    if (regenerate && existingOutput && !hasCheckoutAccess) {
      const currentRegens = existingOutput.regen_count || 0;
      const maxRegens = 1; // 1 regeneration allowed pre-checkout
      
      if (currentRegens >= maxRegens) {
        return NextResponse.json(
          { 
            error: 'Regeneration limit reached',
            message: `You've used all ${maxRegens} regeneration${maxRegens > 1 ? 's' : ''} for this section. Unlock unlimited regenerations for £37.`,
            regens_remaining: 0
          },
          { status: 403 }
        );
      }
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
              ? `You are a business strategy expert. Generate a comprehensive business case for: "${prompt}"

Return ONLY valid JSON with this EXACT structure:
{
  "positioning": "string - how the business positions itself in the market",
  "value_prop": "string - main value proposition",
  "audience_summary": "string - target audience description",
  "offer_bullets": ["string1", "string2", "string3"],
  "brand_identity": {
    "vibe": "string - brand personality",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "pricing": {
    "idea": "string - main pricing recommendation",
    "alternatives": ["alt1", "alt2"]
  },
  "name_ideas": ["name1", "name2", "name3"],
  "taglines": ["tagline1", "tagline2"],
  "risks": ["risk1", "risk2"],
  "first_3_steps": ["step1", "step2", "step3"]
}

Do not include any text outside the JSON.`
              : `You are a viral content strategist. Generate explosive, scroll-stopping content ideas for: "${prompt}"

CRITICAL REQUIREMENTS FOR HOOKS:
- Each hook MUST be a complete TikTok/YouTube-style title or opening line
- Each hook MUST include a curiosity gap or suspense element (e.g., "you won't believe...", "wait for the end...", "which one worked best?")
- Each hook MUST hint at a benefit, transformation, or jaw-dropping result
- Format as natural TikTok/YouTube headlines that stop mid-scroll
- Think MrBeast, Simon Squibb, viral challenges - bold, audacious, attention-grabbing
- NO generic formulas - give me actual, specific hooks ready to use

CRITICAL REQUIREMENTS FOR THEMES:
- Each theme should be BOLD and attention-grabbing (think viral experiments, transformations, challenges)
- Each theme should be repeatable and remixable for multiple videos
- Push to extreme scale when possible (massive giveaways, shocking results, record-breaking attempts)

Return ONLY valid JSON with this EXACT structure:
{
  "channels": ["channel1", "channel2", "channel3"],
  "cadence": {
    "channel1": "frequency description",
    "channel2": "frequency description"
  },
  "tone": "string - scroll-stopping, curiosity-driven content tone",
  "hooks_7": ["Actual viral hook 1 with curiosity gap", "Actual viral hook 2 with transformation", "hook3", "hook4", "hook5", "hook6", "hook7"],
  "thirty_day_themes": ["Week 1: BOLD viral theme", "Week 2: theme", "Week 3: theme", "Week 4: theme"]
}

Do not include any text outside the JSON.`
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

      console.log('AI Response:', aiResponse); // Debug log

      // Parse the AI response as JSON
      try {
        aiContent = JSON.parse(aiResponse);
        
        // Validate the response structure
        if (type === 'business_case') {
          aiContent = validateBusinessCaseResponse(aiContent);
        } else if (type === 'content_strategy') {
          aiContent = validateContentStrategyResponse(aiContent);
        }
        
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw AI Response:', aiResponse);
        // If JSON parsing fails, try to extract JSON from the response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            aiContent = JSON.parse(jsonMatch[0]);
            // Validate the extracted content
            if (type === 'business_case') {
              aiContent = validateBusinessCaseResponse(aiContent);
            } else if (type === 'content_strategy') {
              aiContent = validateContentStrategyResponse(aiContent);
            }
          } catch (validationError) {
            console.error('Validation Error:', validationError);
            throw new Error('Invalid response structure from AI');
          }
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to mock content if AI fails
      aiContent = generateMockContent(type);
    }

    // Calculate new regen count
    const newRegenCount = regenerate && existingOutput 
      ? (existingOutput.regen_count || 0) + 1 
      : 0;

    // Calculate remaining regenerations
    const maxRegensPreCheckout = 1;
    const regensRemaining = hasCheckoutAccess 
      ? 999 // Unlimited after checkout (display as "unlimited")
      : Math.max(0, maxRegensPreCheckout - newRegenCount);

    // Save the generated content
    const outputData = {
      kit_id: id,
      type: type,
      content: JSON.stringify(aiContent),
      regen_count: newRegenCount,
    };

    let savedOutput;
    if (existingOutput) {
      // Update existing
      const { data, error: updateError } = await supabaseAdmin
        .from('outputs')
        .update(outputData as never)
        .eq('id', existingOutput.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating output:', updateError);
        return NextResponse.json(
          { error: 'Failed to update generated content' },
          { status: 500 }
        );
      }
      savedOutput = data;
    } else {
      // Create new
      const { data, error: insertError } = await supabaseAdmin
        .from('outputs')
        .insert(outputData as never)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting output:', insertError);
        return NextResponse.json(
          { error: 'Failed to save generated content' },
          { status: 500 }
        );
      }
      savedOutput = data;
    }

    return NextResponse.json({
      success: true,
      content: aiContent,
      regen_count: newRegenCount,
      regens_remaining: regensRemaining,
      id: savedOutput?.id,
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

// Validation functions for AI responses
function validateBusinessCaseResponse(content: any): any {
  const requiredFields = ['positioning', 'value_prop', 'audience_summary', 'offer_bullets', 'brand_identity', 'pricing', 'name_ideas', 'taglines', 'risks', 'first_3_steps'];
  
  for (const field of requiredFields) {
    if (!content[field]) {
      console.error(`Missing required field: ${field}`);
      throw new Error(`Invalid business case structure: missing ${field}`);
    }
  }
  
  // Validate nested objects
  if (!content.brand_identity.vibe || !Array.isArray(content.brand_identity.keywords)) {
    throw new Error('Invalid brand_identity structure');
  }
  
  if (!content.pricing.idea || !Array.isArray(content.pricing.alternatives)) {
    throw new Error('Invalid pricing structure');
  }
  
  // Ensure arrays are arrays
  const arrayFields = ['offer_bullets', 'name_ideas', 'taglines', 'risks', 'first_3_steps'];
  for (const field of arrayFields) {
    if (!Array.isArray(content[field])) {
      throw new Error(`Invalid ${field}: must be an array`);
    }
  }
  
  return content;
}

function validateContentStrategyResponse(content: any): any {
  const requiredFields = ['channels', 'cadence', 'tone', 'hooks_7', 'thirty_day_themes'];
  
  for (const field of requiredFields) {
    if (!content[field]) {
      console.error(`Missing required field: ${field}`);
      throw new Error(`Invalid content strategy structure: missing ${field}`);
    }
  }
  
  // Validate arrays
  if (!Array.isArray(content.channels) || !Array.isArray(content.hooks_7) || !Array.isArray(content.thirty_day_themes)) {
    throw new Error('Invalid array structure in content strategy');
  }
  
  // Validate cadence is an object
  if (typeof content.cadence !== 'object' || Array.isArray(content.cadence)) {
    throw new Error('Invalid cadence structure: must be an object');
  }
  
  return content;
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
      channels: ["TikTok", "Instagram Reels", "YouTube Shorts", "Twitter/X"],
      cadence: {
        "TikTok": "3-5 videos per day for maximum virality",
        "Instagram Reels": "2-3 reels per day + daily stories",
        "YouTube Shorts": "1-2 shorts per day",
        "Twitter/X": "5-10 tweets per day + viral threads"
      },
      tone: "Scroll-stopping, curiosity-driven, with bold transformations",
      hooks_7: [
        "I turned $100 into $10,000 in 30 days doing THIS... (you won't believe #3)",
        "Giving away $1,000 to whoever can guess my secret strategy",
        "This ONE thing got me 100k followers in 30 days (but nobody talks about it)",
        "Watch me build a business from $0 in 24 hours (LIVE)",
        "I tested every viral strategy for 30 days... here's what ACTUALLY worked",
        "They said it was impossible, so I proved them wrong (see the results)",
        "POV: You're about to discover the method that changed EVERYTHING"
      ],
      thirty_day_themes: [
        "Week 1: The $0-$1000 Challenge - Documenting the Journey",
        "Week 2: Testing EVERY Viral Strategy (Which One Wins?)",
        "Week 3: The Transformation Week - Before vs After Reveal",
        "Week 4: The Big Experiment - Going ALL IN (Final Results)"
      ]
    },
  };

  return baseContent[type as keyof typeof baseContent] || {};
}