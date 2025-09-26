import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PromptAssembler } from '@/lib/prompt-assembler';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type } = await request.json();

    if (!type || !['business_case', 'content_strategy', 'website_content'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid content type. Must be business_case, content_strategy, or website_content' },
        { status: 400 }
      );
    }

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

    // Create prompt assembler with simplified data
    const profilingData = {
      audienceDetail: '',
      outcomePreference: '',
      tonePreference: ''
    };
    const selectedOptions = {};
    const promptAssembler = new PromptAssembler(kit, profilingData, selectedOptions);

    // Generate the appropriate prompt
    let prompt: string;
    switch (type) {
      case 'business_case':
        prompt = promptAssembler.generateBusinessCasePrompt();
        break;
      case 'content_strategy':
        prompt = promptAssembler.generateContentStrategyPrompt();
        break;
      case 'website_content':
        prompt = promptAssembler.generateWebsiteContentPrompt();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    // TODO: Replace with actual OpenAI API call
    // For now, return a mock response
    const mockContent = generateMockContent(type);

    // Save the generated content
    const { error: saveError } = await supabaseAdmin
      .from('outputs')
      .upsert({
        kit_id: id,
        type: type,
        content: JSON.stringify(mockContent),
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
      content: mockContent,
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
    website_content: {
      hero: {
        headline: "Launch Your Business in 30 Days",
        subheadline: "Get everything you need to go from idea to first customers with our proven system",
        cta: "Start Your Launch Kit"
      },
      value_props: [
        "Complete business setup in 30 days",
        "Proven framework used by 500+ entrepreneurs",
        "Ongoing support and optimization"
      ],
      about: "We help entrepreneurs turn their ideas into profitable businesses. Our proven system has helped over 500 people launch successfully, generating over £2M in combined revenue.",
      social_proof: "Join 500+ successful entrepreneurs who have launched with our system",
      faq: [
        {
          question: "How long does the setup take?",
          answer: "Most people complete the initial setup in 2-4 weeks, depending on their availability."
        },
        {
          question: "What if I need help?",
          answer: "We provide ongoing support via email and our community forum."
        }
      ],
      meta_description: "Launch your business in 30 days with our proven system. Complete setup, ongoing support, and proven results. Join 500+ successful entrepreneurs."
    }
  };

  return baseContent[type as keyof typeof baseContent] || {};
}