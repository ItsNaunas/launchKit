export interface PersonaTemplate {
  name: string;
  description: string;
  expertise: string[];
  painPoints: string[];
  goals: string[];
  tone: string;
  contentFocus: string[];
  platformPreferences: string[];
  pricingSensitivity: 'low' | 'medium' | 'high';
  timeAvailability: 'low' | 'medium' | 'high';
}

export const PERSONA_TEMPLATES: Record<string, PersonaTemplate> = {
  barber: {
    name: 'Local Barber Shop Owner',
    description: 'Experienced barber who understands community building, customer relationships, and local marketing',
    expertise: ['Hair cutting', 'Customer service', 'Local networking', 'Community building'],
    painPoints: ['Finding new customers', 'Retaining existing clients', 'Competing with chains', 'Seasonal fluctuations'],
    goals: ['Build loyal customer base', 'Increase walk-ins', 'Create recurring revenue', 'Expand services'],
    tone: 'Friendly, professional, community-focused',
    contentFocus: ['Before/after photos', 'Customer testimonials', 'Hair care tips', 'Local community events'],
    platformPreferences: ['Instagram', 'Facebook', 'Google My Business', 'TikTok'],
    pricingSensitivity: 'medium',
    timeAvailability: 'low'
  },

  baker: {
    name: 'Artisan Baker',
    description: 'Passionate baker who creates beautiful, delicious products and builds community around their craft',
    expertise: ['Baking techniques', 'Recipe development', 'Food presentation', 'Customer service'],
    painPoints: ['Seasonal demand', 'Ingredient costs', 'Competition with supermarkets', 'Waste management'],
    goals: ['Build brand recognition', 'Create signature products', 'Expand customer base', 'Increase average order value'],
    tone: 'Warm, creative, authentic, community-focused',
    contentFocus: ['Product photos', 'Behind-the-scenes', 'Recipe tips', 'Seasonal specials'],
    platformPreferences: ['Instagram', 'TikTok', 'Facebook', 'Pinterest'],
    pricingSensitivity: 'medium',
    timeAvailability: 'medium'
  },

  tutor: {
    name: 'Private Tutor/Educator',
    description: 'Experienced educator who understands learning styles, student motivation, and effective teaching methods',
    expertise: ['Subject knowledge', 'Teaching methods', 'Student assessment', 'Parent communication'],
    painPoints: ['Finding students', 'Scheduling conflicts', 'Student retention', 'Competing with online platforms'],
    goals: ['Build reputation', 'Increase student referrals', 'Develop teaching materials', 'Scale business'],
    tone: 'Professional, encouraging, knowledgeable, patient',
    contentFocus: ['Study tips', 'Success stories', 'Educational content', 'Parent testimonials'],
    platformPreferences: ['LinkedIn', 'Facebook', 'Instagram', 'YouTube'],
    pricingSensitivity: 'high',
    timeAvailability: 'medium'
  },

  dtc: {
    name: 'Direct-to-Consumer Brand',
    description: 'E-commerce entrepreneur who understands digital marketing, customer acquisition, and brand building',
    expertise: ['Digital marketing', 'E-commerce', 'Brand building', 'Customer acquisition'],
    painPoints: ['High acquisition costs', 'Competition', 'Customer retention', 'Scaling operations'],
    goals: ['Increase brand awareness', 'Improve conversion rates', 'Build customer loyalty', 'Scale profitably'],
    tone: 'Modern, aspirational, results-focused, brand-conscious',
    contentFocus: ['Product features', 'Customer testimonials', 'Lifestyle content', 'Behind-the-scenes'],
    platformPreferences: ['Instagram', 'TikTok', 'Facebook', 'YouTube'],
    pricingSensitivity: 'low',
    timeAvailability: 'high'
  },

  agency: {
    name: 'Marketing Agency Owner',
    description: 'Marketing professional who understands client relationships, service delivery, and business growth',
    expertise: ['Marketing strategy', 'Client management', 'Service delivery', 'Business development'],
    painPoints: ['Finding quality clients', 'Managing client expectations', 'Scaling services', 'Retaining talent'],
    goals: ['Build agency reputation', 'Increase client retention', 'Scale service offerings', 'Improve profit margins'],
    tone: 'Professional, results-focused, authoritative, consultative',
    contentFocus: ['Case studies', 'Industry insights', 'Client results', 'Thought leadership'],
    platformPreferences: ['LinkedIn', 'Twitter', 'YouTube', 'Blog'],
    pricingSensitivity: 'low',
    timeAvailability: 'high'
  },

  consultant: {
    name: 'Business Consultant',
    description: 'Experienced consultant who provides strategic advice and helps businesses solve complex problems',
    expertise: ['Strategic planning', 'Problem solving', 'Industry knowledge', 'Client management'],
    painPoints: ['Finding ideal clients', 'Demonstrating value', 'Managing scope creep', 'Building credibility'],
    goals: ['Build thought leadership', 'Increase referral rates', 'Develop signature frameworks', 'Scale consulting practice'],
    tone: 'Authoritative, insightful, professional, results-focused',
    contentFocus: ['Industry analysis', 'Case studies', 'Strategic insights', 'Client success stories'],
    platformPreferences: ['LinkedIn', 'Twitter', 'YouTube', 'Podcast'],
    pricingSensitivity: 'low',
    timeAvailability: 'high'
  },

  coach: {
    name: 'Life/Business Coach',
    description: 'Motivational coach who helps people achieve personal and professional goals through guidance and accountability',
    expertise: ['Goal setting', 'Motivation', 'Accountability', 'Personal development'],
    painPoints: ['Client commitment', 'Demonstrating results', 'Finding ideal clients', 'Building trust'],
    goals: ['Build coaching practice', 'Increase client success rates', 'Develop signature programs', 'Scale impact'],
    tone: 'Motivational, supportive, authentic, empowering',
    contentFocus: ['Success stories', 'Motivational content', 'Tips and strategies', 'Client transformations'],
    platformPreferences: ['Instagram', 'YouTube', 'TikTok', 'Facebook'],
    pricingSensitivity: 'medium',
    timeAvailability: 'medium'
  }
};

export function getPersonaTemplate(persona: string): PersonaTemplate | null {
  return PERSONA_TEMPLATES[persona] || null;
}

export function getAllPersonas(): PersonaTemplate[] {
  return Object.values(PERSONA_TEMPLATES);
}

export function getPersonaByCategory(category: string): PersonaTemplate[] {
  const categoryMapping: Record<string, string[]> = {
    'service': ['barber', 'tutor', 'consultant', 'coach'],
    'product': ['baker', 'dtc'],
    'local': ['barber', 'baker'],
    'content': ['coach', 'consultant'],
    'e-com': ['dtc'],
    'saas': ['agency', 'consultant']
  };

  const personas = categoryMapping[category] || [];
  return personas.map(persona => PERSONA_TEMPLATES[persona]).filter(Boolean);
}
