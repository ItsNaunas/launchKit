// Helper utilities for working with website templates

import { type TemplateConfig } from './website-templates';

/**
 * Extract content from business case for template population
 */
export function extractTemplateContent(kit: any, businessCase: any) {
  return {
    businessName: kit.title || 'Your Business',
    tagline: businessCase?.taglines?.[0] || kit.one_liner || 'Your tagline here',
    description: businessCase?.positioning || kit.target_audience || 'Your business description',
    features: businessCase?.offer_bullets || [
      'Quality products and services',
      'Expert team and support',
      'Customer-focused approach'
    ],
    ctaText: 'Get Started',
    ctaUrl: '#contact',
    testimonials: businessCase?.testimonials || [],
    pricing: businessCase?.pricing?.idea || 'Contact for pricing',
  };
}

/**
 * Validate template configuration
 */
export function validateTemplate(template: TemplateConfig): boolean {
  if (!template.id || !template.name) {
    console.error('Template must have id and name');
    return false;
  }

  if (!template.defaultColors || Object.keys(template.defaultColors).length === 0) {
    console.error('Template must have default colors');
    return false;
  }

  if (!template.sections || template.sections.length === 0) {
    console.error('Template must have at least one section');
    return false;
  }

  return true;
}

/**
 * Generate color variations from a base color
 */
export function generateColorVariations(baseColor: string) {
  // This is a simplified version - in production, use a proper color library
  return {
    primary: baseColor,
    secondary: adjustBrightness(baseColor, 20),
    accent: adjustHue(baseColor, 30),
    background: '#ffffff',
    text: '#1f2937',
  };
}

/**
 * Adjust color brightness (simplified)
 */
function adjustBrightness(color: string, percent: number): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Adjust brightness
  const adjust = (val: number) => {
    const adjusted = val + (val * percent / 100);
    return Math.min(255, Math.max(0, Math.round(adjusted)));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Adjust color hue (simplified)
 */
function adjustHue(color: string, _degrees: number): string {
  // Simplified - just return a complementary color for now
  return color; // In production, use HSL conversion
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  // Remove potentially dangerous elements
  const dangerous = ['script', 'iframe', 'embed', 'object'];
  let sanitized = html;

  dangerous.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  return sanitized;
}

/**
 * Inject tracking code into HTML
 */
export function injectTracking(html: string, trackingId?: string): string {
  if (!trackingId) return html;

  const trackingScript = `
  <!-- Analytics -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${trackingId}');
  </script>
  `;

  return html.replace('</head>', `${trackingScript}</head>`);
}

/**
 * Optimize HTML for production
 */
export function optimizeHtml(html: string): string {
  let optimized = html;

  // Remove comments
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

  // Minify whitespace (preserve content)
  optimized = optimized.replace(/>\s+</g, '><');

  // Remove data attributes used for editing
  optimized = optimized.replace(/\s*data-field="[^"]*"/g, '');
  optimized = optimized.replace(/\s*contenteditable="true"/g, '');

  return optimized;
}

/**
 * Generate meta tags from content
 */
export function generateMetaTags(content: {
  businessName: string;
  tagline: string;
  description: string;
}): string {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${content.description}">
  <meta name="keywords" content="${content.businessName}, ${content.tagline}">
  <meta property="og:title" content="${content.businessName} - ${content.tagline}">
  <meta property="og:description" content="${content.description}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${content.businessName}">
  <meta name="twitter:description" content="${content.description}">
  <title>${content.businessName} - ${content.tagline}</title>
  `.trim();
}

/**
 * Create a complete standalone HTML file
 */
export function createStandaloneHtml(
  html: string,
  css?: string,
  title?: string
): string {
  const cssBlock = css ? `<style>${css}</style>` : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'My Website'}</title>
  ${cssBlock}
</head>
${html.includes('<body') ? html : `<body>${html}</body>`}
</html>`;
}

/**
 * Parse sections from HTML
 */
export function parseSections(html: string): Array<{
  id: string;
  type: string;
  content: string;
}> {
  const sections: Array<{ id: string; type: string; content: string }> = [];
  const sectionRegex = /<section[^>]*data-section="([^"]+)"[^>]*>([\s\S]*?)<\/section>/gi;
  
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    sections.push({
      id: match[1],
      type: match[1],
      content: match[2],
    });
  }

  return sections;
}

/**
 * Update section in HTML
 */
export function updateSection(
  html: string,
  sectionId: string,
  newContent: string
): string {
  const regex = new RegExp(
    `(<section[^>]*data-section="${sectionId}"[^>]*>)([\\s\\S]*?)(<\\/section>)`,
    'i'
  );
  
  return html.replace(regex, `$1${newContent}$3`);
}

/**
 * Get template preview thumbnail
 */
export function getTemplateThumbnail(templateId: string): string {
  // In production, these would be actual screenshot URLs
  return `/templates/${templateId}-preview.jpg`;
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Check if template is mobile-responsive
 */
export function isMobileResponsive(html: string): boolean {
  // Check for viewport meta tag and media queries
  const hasViewport = html.includes('viewport');
  const hasMediaQueries = html.includes('@media');
  return hasViewport && hasMediaQueries;
}

/**
 * Generate CSS variables from color config
 */
export function generateCssVariables(colors: Record<string, string>): string {
  const variables = Object.entries(colors)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join('\n');
  
  return `:root {\n${variables}\n}`;
}

/**
 * Validate color hex code
 */
export function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Extract colors from HTML/CSS
 */
export function extractColors(html: string, css?: string): string[] {
  const colorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
  const colors = new Set<string>();
  
  // Extract from HTML
  const htmlMatches = html.matchAll(colorRegex);
  for (const match of htmlMatches) {
    colors.add(match[0]);
  }
  
  // Extract from CSS
  if (css) {
    const cssMatches = css.matchAll(colorRegex);
    for (const match of cssMatches) {
      colors.add(match[0]);
    }
  }
  
  return Array.from(colors);
}

