// Website template library with PROFESSIONAL built-in templates
// Premium quality templates with extensive customization

import { generatePremiumModernLanding, DEFAULT_CUSTOMIZATION as PRO_DEFAULT } from './website-templates-pro';

export interface TemplateCustomization {
  // Typography
  fontFamily: 'modern' | 'classic' | 'bold' | 'elegant';
  fontSize: 'compact' | 'normal' | 'large';
  
  // Layout
  headerStyle: 'minimal' | 'centered' | 'split' | 'overlay';
  spacing: 'tight' | 'normal' | 'relaxed';
  containerWidth: 'narrow' | 'normal' | 'wide' | 'full';
  
  // Visual Effects
  animations: boolean;
  shadows: 'none' | 'soft' | 'strong';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  
  // Components
  showNav: boolean;
  showStats: boolean;
  showTestimonials: boolean;
  showPricing: boolean;
  showFAQ: boolean;
}

export const DEFAULT_CUSTOMIZATION: TemplateCustomization = {
  fontFamily: 'modern',
  fontSize: 'normal',
  headerStyle: 'centered',
  spacing: 'normal',
  containerWidth: 'normal',
  animations: true,
  shadows: 'soft',
  borderRadius: 'medium',
  showNav: true,
  showStats: true,
  showTestimonials: true,
  showPricing: false,
  showFAQ: false,
};

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'landing' | 'portfolio' | 'business' | 'ecommerce' | 'saas';
  thumbnail: string;
  source: 'built-in' | 'github';
  githubUrl?: string;
  defaultColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  sections: string[]; // Available section types
  customization?: TemplateCustomization; // NEW: Customization options
}

export const BUILT_IN_TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern-landing',
    name: 'Modern Landing',
    description: 'Clean, modern landing page perfect for SaaS and digital products',
    category: 'landing',
    thumbnail: '/templates/modern-landing.jpg',
    source: 'built-in',
    defaultColors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937',
    },
    sections: ['hero', 'features', 'pricing', 'testimonials', 'cta', 'footer'],
  },
  {
    id: 'minimal-portfolio',
    name: 'Minimal Portfolio',
    description: 'Elegant, minimal design for professionals and creatives',
    category: 'portfolio',
    thumbnail: '/templates/minimal-portfolio.jpg',
    source: 'built-in',
    defaultColors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#f9fafb',
      text: '#111827',
    },
    sections: ['hero', 'about', 'portfolio', 'services', 'contact', 'footer'],
  },
  {
    id: 'bold-startup',
    name: 'Bold Startup',
    description: 'High-energy design for disruptive brands and startups',
    category: 'business',
    thumbnail: '/templates/bold-startup.jpg',
    source: 'built-in',
    defaultColors: {
      primary: '#ef4444',
      secondary: '#f97316',
      accent: '#eab308',
      background: '#0f172a',
      text: '#f1f5f9',
    },
    sections: ['hero', 'problem', 'solution', 'features', 'team', 'cta', 'footer'],
  },
  {
    id: 'luxury-brand',
    name: 'Luxury Brand',
    description: 'Premium, sophisticated design for luxury products and services',
    category: 'ecommerce',
    thumbnail: '/templates/luxury-brand.jpg',
    source: 'built-in',
    defaultColors: {
      primary: '#92400e',
      secondary: '#78350f',
      accent: '#fbbf24',
      background: '#fffbeb',
      text: '#1c1917',
    },
    sections: ['hero', 'collection', 'about', 'features', 'testimonials', 'footer'],
  },
];

// GitHub template sources (popular open-source templates)
export const GITHUB_TEMPLATES: TemplateConfig[] = [
  {
    id: 'html5up-strata',
    name: 'Strata Portfolio',
    description: 'Responsive portfolio template from HTML5 UP',
    category: 'portfolio',
    thumbnail: '/templates/github-strata.jpg',
    source: 'github',
    githubUrl: 'https://github.com/CloudCannon/strata-jekyll-template',
    defaultColors: {
      primary: '#49bf9d',
      secondary: '#5ccfe6',
      accent: '#ffd699',
      background: '#ffffff',
      text: '#1f2937',
    },
    sections: ['hero', 'portfolio', 'about', 'contact', 'footer'],
  },
  {
    id: 'html5up-landed',
    name: 'Landed Business',
    description: 'Modern business template from HTML5 UP',
    category: 'business',
    thumbnail: '/templates/github-landed.jpg',
    source: 'github',
    githubUrl: 'https://github.com/CloudCannon/landed-jekyll-template',
    defaultColors: {
      primary: '#5e42a6',
      secondary: '#b74e91',
      accent: '#f2849e',
      background: '#ffffff',
      text: '#1f2937',
    },
    sections: ['hero', 'features', 'services', 'team', 'cta', 'footer'],
  },
];

export const ALL_TEMPLATES = [...BUILT_IN_TEMPLATES, ...GITHUB_TEMPLATES];

export function getTemplateById(id: string): TemplateConfig | undefined {
  return ALL_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: TemplateConfig['category']): TemplateConfig[] {
  return ALL_TEMPLATES.filter(t => t.category === category);
}

// Generate HTML from template
export function generateTemplateHTML(
  templateId: string,
  content: {
    businessName: string;
    tagline: string;
    description: string;
    features?: string[];
    ctaText?: string;
    ctaUrl?: string;
  },
  colors?: TemplateConfig['defaultColors']
): string {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const finalColors = colors || template.defaultColors;

  // Generate HTML based on template type
  switch (templateId) {
    case 'modern-landing':
      return generateModernLandingHTML(content, finalColors);
    case 'minimal-portfolio':
      return generateMinimalPortfolioHTML(content, finalColors);
    case 'bold-startup':
      return generateBoldStartupHTML(content, finalColors);
    case 'luxury-brand':
      return generateLuxuryBrandHTML(content, finalColors);
    default:
      return generateDefaultHTML(content, finalColors);
  }
}

// Template generators - Now using PROFESSIONAL templates
function generateModernLandingHTML(
  content: any,
  colors: TemplateConfig['defaultColors']
): string {
  // Use the premium professional template with all customizations
  return generatePremiumModernLanding(content, colors, PRO_DEFAULT);
}

// Keep old simple version as fallback
function generateModernLandingHTMLOld(
  content: any,
  colors: TemplateConfig['defaultColors']
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.businessName} - ${content.tagline}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: ${colors.text};
      background: ${colors.background};
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
      color: white;
      text-align: center;
      padding: 60px 20px;
    }
    
    .hero h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    
    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: white;
      color: ${colors.primary};
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    /* Features Section */
    .features {
      padding: 100px 20px;
      background: white;
    }
    
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: ${colors.text};
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
      margin-top: 60px;
    }
    
    .feature-card {
      padding: 40px;
      background: ${colors.background};
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }
    
    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: ${colors.primary};
    }
    
    .feature-card p {
      color: ${colors.text};
      opacity: 0.8;
    }
    
    /* Footer */
    .footer {
      padding: 40px 20px;
      background: ${colors.text};
      color: white;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.5rem;
      }
      .hero p {
        font-size: 1.2rem;
      }
    }
  </style>
</head>
<body>
  <!-- Hero Section -->
  <section class="hero" data-section="hero">
    <div class="container">
      <h1 contenteditable="true" data-field="businessName">${content.businessName}</h1>
      <p contenteditable="true" data-field="tagline">${content.tagline}</p>
      <a href="${content.ctaUrl || '#'}" class="cta-button" contenteditable="true" data-field="ctaText">${content.ctaText || 'Get Started'}</a>
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="features" data-section="features">
    <div class="container">
      <h2 class="section-title" contenteditable="true">Why Choose Us</h2>
      <div class="features-grid">
        ${(content.features || ['Feature 1', 'Feature 2', 'Feature 3']).map((feature: string, i: number) => `
          <div class="feature-card">
            <h3 contenteditable="true" data-field="feature-${i}-title">Feature ${i + 1}</h3>
            <p contenteditable="true" data-field="feature-${i}-description">${feature}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  
  <!-- Footer -->
  <footer class="footer" data-section="footer">
    <div class="container">
      <p contenteditable="true">© 2024 ${content.businessName}. All rights reserved.</p>
    </div>
  </footer>
  
  <script>
    // Simple inline editing
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.addEventListener('blur', function() {
        console.log('Updated:', this.dataset.field, this.textContent);
      });
    });
  </script>
</body>
</html>`;
}

function generateMinimalPortfolioHTML(
  content: any,
  colors: TemplateConfig['defaultColors']
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.businessName} - Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: ${colors.text};
      background: ${colors.background};
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 40px;
    }
    
    .hero {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 100px 20px;
    }
    
    .hero h1 {
      font-size: 4rem;
      font-weight: 300;
      letter-spacing: -2px;
      margin-bottom: 1rem;
    }
    
    .hero p {
      font-size: 1.3rem;
      color: ${colors.secondary};
      font-style: italic;
    }
    
    .divider {
      width: 60px;
      height: 2px;
      background: ${colors.accent};
      margin: 60px auto;
    }
    
    .content-section {
      padding: 60px 20px;
    }
    
    .section-title {
      font-size: 2rem;
      font-weight: 300;
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }
    
    .card {
      padding: 30px;
      background: white;
      border: 1px solid #e5e7eb;
    }
    
    footer {
      padding: 60px 20px;
      text-align: center;
      color: ${colors.secondary};
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <section class="hero" data-section="hero">
    <div class="container">
      <h1 contenteditable="true">${content.businessName}</h1>
      <p contenteditable="true">${content.tagline}</p>
    </div>
  </section>
  
  <div class="divider"></div>
  
  <section class="content-section" data-section="content">
    <div class="container">
      <h2 class="section-title" contenteditable="true">What I Do</h2>
      <div class="grid">
        ${(content.features || ['Service 1', 'Service 2', 'Service 3']).map((feature: string) => `
          <div class="card">
            <p contenteditable="true">${feature}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  
  <footer data-section="footer">
    <p contenteditable="true">© 2024 ${content.businessName}</p>
  </footer>
</body>
</html>`;
}

function generateBoldStartupHTML(content: any, colors: TemplateConfig['defaultColors']): string {
  return generateModernLandingHTML(content, colors); // Simplified for now
}

function generateLuxuryBrandHTML(content: any, colors: TemplateConfig['defaultColors']): string {
  return generateMinimalPortfolioHTML(content, colors); // Simplified for now
}

function generateDefaultHTML(content: any, colors: TemplateConfig['defaultColors']): string {
  return generateModernLandingHTML(content, colors);
}

