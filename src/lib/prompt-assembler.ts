import { IntakeFormData, MiniIntakeData } from './schemas';
import { getPersonaTemplate } from './persona-templates';

export interface ProfilingData {
  audienceDetail: string;
  outcomePreference: string;
  tonePreference: string;
}

export interface SelectedOptions {
  [step: number]: string;
}

export interface PromptContext {
  // Basic info
  businessIdea: string;
  budget: string;
  challenges: string[];
  
  // Profiling data
  audienceDetail: string;
  outcomePreference: string;
  tonePreference: string;
  
  // Selected options from teaser
  businessCase: string;
  contentStrategy: string;
  websiteApproach: string;
  
  // Additional context
  category?: string;
  geography?: string;
  timeHorizon?: string;
}

export class PromptAssembler {
  private context: PromptContext;

  constructor(
    intakeData: IntakeFormData | MiniIntakeData,
    profilingData: ProfilingData,
    selectedOptions: SelectedOptions
  ) {
    this.context = this.buildContext(intakeData, profilingData, selectedOptions);
  }

  private buildContext(
    intakeData: IntakeFormData | MiniIntakeData,
    profilingData: ProfilingData,
    selectedOptions: SelectedOptions
  ): PromptContext {
    // Handle both mini and full intake data
    const isMiniIntake = 'business_idea' in intakeData;
    
    return {
      businessIdea: isMiniIntake ? intakeData.business_idea : intakeData.one_liner,
      budget: isMiniIntake ? intakeData.budget : intakeData.budget_band,
      challenges: isMiniIntake ? intakeData.challenges : intakeData.top_3_challenges,
      audienceDetail: profilingData.audienceDetail,
      outcomePreference: profilingData.outcomePreference,
      tonePreference: profilingData.tonePreference,
      businessCase: this.getBusinessCaseDescription(selectedOptions[1]),
      contentStrategy: this.getContentStrategyDescription(selectedOptions[2]),
      websiteApproach: this.getWebsiteApproachDescription(selectedOptions[3]),
      category: isMiniIntake ? 'service' : intakeData.category,
      geography: isMiniIntake ? 'UK' : intakeData.geography,
      timeHorizon: isMiniIntake ? '30d' : intakeData.time_horizon,
    };
  }

  private getBusinessCaseDescription(option: string): string {
    const descriptions = {
      'A': 'Market-First Approach: Position as premium solution in growing market, target professionals who value quality, focus on ROI and time-saving benefits',
      'B': 'Problem-First Approach: Solve biggest pain point in industry, target frustrated users of existing solutions, focus on ease of use and immediate results',
      'C': 'Community-First Approach: Build around passionate community, target early adopters and enthusiasts, focus on exclusivity and insider benefits'
    };
    return descriptions[option as keyof typeof descriptions] || 'Standard business approach';
  }

  private getContentStrategyDescription(option: string): string {
    const descriptions = {
      'A': 'Educational Content: Focus on teaching and building authority through tutorials, case studies, and industry insights',
      'B': 'Behind-the-Scenes: Share journey and build personal connection through authentic storytelling and process videos',
      'C': 'Results-Driven: Showcase success stories and social proof through testimonials, metrics, and before/after content'
    };
    return descriptions[option as keyof typeof descriptions] || 'Standard content strategy';
  }

  private getWebsiteApproachDescription(option: string): string {
    const descriptions = {
      'A': 'Value-Led Website: Clear benefits and ROI-focused messaging, hero focuses on time-saving and cost-effectiveness',
      'B': 'Story-Led Website: Personal journey and mission-driven approach, hero tells your story and the problem you solved',
      'C': 'Results-Led Website: Social proof and case study focused, hero showcases customer success and testimonials'
    };
    return descriptions[option as keyof typeof descriptions] || 'Standard website approach';
  }

  // Generate business case prompt
  generateBusinessCasePrompt(): string {
    const { businessIdea, audienceDetail, outcomePreference, tonePreference, businessCase } = this.context;
    
    return `Create a comprehensive business case for: "${businessIdea}"

CONTEXT:
- Business Approach: ${businessCase}
- Target Audience: ${audienceDetail}
- Primary Outcome: ${outcomePreference}
- Tone Preference: ${tonePreference}

REQUIREMENTS:
Generate a detailed business case that includes:
1. Positioning statement
2. Value proposition
3. Target audience summary
4. Key offer bullets
5. Brand identity (vibe + keywords)
6. Pricing strategy with alternatives
7. Name ideas (3-5 options)
8. Taglines (3-5 options)
9. Key risks to address
10. First 3 steps to launch

Make it specific, actionable, and tailored to the audience and outcome preference. Use the tone preference throughout.`;
  }

  // Generate content strategy prompt
  generateContentStrategyPrompt(): string {
    const { businessIdea, audienceDetail, tonePreference, contentStrategy, challenges } = this.context;
    
    return `Create a content strategy for: "${businessIdea}"

CONTEXT:
- Content Focus: ${contentStrategy}
- Target Audience: ${audienceDetail}
- Tone: ${tonePreference}
- Key Challenges: ${challenges.join(', ')}

REQUIREMENTS:
Generate a comprehensive content strategy including:
1. Primary content channels (3-4 platforms)
2. Posting cadence for each channel
3. Content tone and voice guidelines
4. 7 hook formulas that work for this audience
5. 30-day content themes (7 themes)
6. Content pillars and topics
7. Engagement strategies
8. Growth tactics specific to chosen channels

Make it platform-specific and audience-focused. Address the key challenges through content.`;
  }

  // Generate website content prompt
  generateWebsiteContentPrompt(): string {
    const { businessIdea, audienceDetail, tonePreference, websiteApproach, outcomePreference } = this.context;
    
    return `Create website content for: "${businessIdea}"

CONTEXT:
- Website Approach: ${websiteApproach}
- Target Audience: ${audienceDetail}
- Tone: ${tonePreference}
- Primary Goal: ${outcomePreference}

REQUIREMENTS:
Generate complete website copy including:
1. Hero section (headline + subheadline + CTA)
2. Value proposition bullets (3-4 key benefits)
3. About section (story-driven)
4. Social proof section
5. FAQ section (5-7 questions)
6. Footer content
7. Meta descriptions for SEO
8. Call-to-action variations

Make it conversion-focused and aligned with the website approach. Use the tone preference consistently.`;
  }

  // Generate persona-specific prompt
  generatePersonaPrompt(persona: string): string {
    const { businessIdea, audienceDetail, tonePreference } = this.context;
    
    const personaTemplate = getPersonaTemplate(persona);
    if (!personaTemplate) {
      return `You are a business expert with deep industry knowledge.

Create content for: "${businessIdea}"
Target Audience: ${audienceDetail}
Tone: ${tonePreference}

Provide specific, actionable advice based on your experience and expertise.`;
    }

    return `You are ${personaTemplate.name}: ${personaTemplate.description}

Your expertise includes: ${personaTemplate.expertise.join(', ')}
You understand these pain points: ${personaTemplate.painPoints.join(', ')}
Your goals are: ${personaTemplate.goals.join(', ')}

Create content for: "${businessIdea}"
Target Audience: ${audienceDetail}
Tone: ${tonePreference}
Content Focus: ${personaTemplate.contentFocus.join(', ')}
Platform Preferences: ${personaTemplate.platformPreferences.join(', ')}

Provide specific, actionable advice that this persona would give based on their experience, expertise, and understanding of their audience's pain points and goals.`;
  }

  // Get context summary for debugging
  getContextSummary(): string {
    return `Business: ${this.context.businessIdea}
Audience: ${this.context.audienceDetail}
Outcome: ${this.context.outcomePreference}
Tone: ${this.context.tonePreference}
Business Case: ${this.context.businessCase}
Content Strategy: ${this.context.contentStrategy}
Website Approach: ${this.context.websiteApproach}`;
  }
}
