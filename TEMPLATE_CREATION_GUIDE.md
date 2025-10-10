# 🎨 How to Add New Templates - Best Practices

## 🚀 **Recommended Approach: Built-In Templates**

This is the BEST way to add templates because:
- Full control over AI content insertion
- Fast performance
- Easy to maintain
- No external dependencies

---

## 📝 **Step-by-Step: Add a New Built-In Template**

### **Step 1: Design Your Template**

Create your HTML/CSS locally first. Good places to find inspiration:
- **HTML5 UP** (https://html5up.net) - Free templates
- **TailwindUI** (https://tailwindui.com/components) - Components
- **CodePen** (https://codepen.io) - Examples
- **Dribbble** (https://dribbble.com) - Design inspiration

### **Step 2: Add Template Config**

Open `src/lib/website-templates.ts`:

```typescript
export const BUILT_IN_TEMPLATES: TemplateConfig[] = [
  // ... existing templates
  
  // Add your new template
  {
    id: 'professional-services',  // unique ID (kebab-case)
    name: 'Professional Services', // display name
    description: 'Clean design for consultants, agencies, and service providers',
    category: 'business', // landing, portfolio, business, ecommerce, saas
    thumbnail: '/templates/professional-services.jpg',
    source: 'built-in',
    defaultColors: {
      primary: '#2563eb',    // Main brand color
      secondary: '#7c3aed',  // Accent color
      accent: '#f59e0b',     // Highlight color
      background: '#ffffff', // Background
      text: '#1f2937',       // Text color
    },
    sections: ['hero', 'services', 'about', 'testimonials', 'contact', 'footer'],
  },
];
```

### **Step 3: Create Generator Function**

Add your HTML generator function:

```typescript
function generateProfessionalServicesHTML(
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: ${colors.text};
    }
    
    /* Hero Section */
    .hero {
      min-height: 100vh;
      background: ${colors.primary};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    
    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }
    
    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .cta-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: ${colors.accent};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
    }
    
    /* Services Section */
    .services {
      padding: 5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-title {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .service-card {
      padding: 2rem;
      border: 2px solid ${colors.primary};
      border-radius: 12px;
      transition: transform 0.2s;
    }
    
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .service-card h3 {
      color: ${colors.primary};
      margin-bottom: 1rem;
    }
    
    /* Footer */
    footer {
      background: ${colors.text};
      color: white;
      text-align: center;
      padding: 2rem;
    }
    
    /* Mobile Responsive */
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
    <div>
      <h1 contenteditable="true" data-field="businessName">${content.businessName}</h1>
      <p contenteditable="true" data-field="tagline">${content.tagline}</p>
      <a href="${content.ctaUrl || '#'}" class="cta-button" contenteditable="true">
        ${content.ctaText || 'Get Started'}
      </a>
    </div>
  </section>
  
  <!-- Services Section -->
  <section class="services" data-section="services">
    <h2 class="section-title" contenteditable="true">Our Services</h2>
    <div class="services-grid">
      ${(content.features || ['Service 1', 'Service 2', 'Service 3']).map((feature: string, i: number) => `
        <div class="service-card">
          <h3 contenteditable="true" data-field="service-${i}-title">Service ${i + 1}</h3>
          <p contenteditable="true" data-field="service-${i}-description">${feature}</p>
        </div>
      `).join('')}
    </div>
  </section>
  
  <!-- Footer -->
  <footer data-section="footer">
    <p contenteditable="true">© 2024 ${content.businessName}. All rights reserved.</p>
  </footer>
  
  <script>
    // Enable inline editing
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.addEventListener('blur', function() {
        console.log('Updated:', this.dataset.field, this.textContent);
      });
    });
  </script>
</body>
</html>`;
}
```

### **Step 4: Register in Switch Statement**

Update the `generateTemplateHTML()` function:

```typescript
export function generateTemplateHTML(
  templateId: string,
  content: any,
  colors?: TemplateConfig['defaultColors']
): string {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const finalColors = colors || template.defaultColors;

  switch (templateId) {
    case 'modern-landing':
      return generateModernLandingHTML(content, finalColors);
    case 'minimal-portfolio':
      return generateMinimalPortfolioHTML(content, finalColors);
    case 'bold-startup':
      return generateBoldStartupHTML(content, finalColors);
    case 'luxury-brand':
      return generateLuxuryBrandHTML(content, finalColors);
    
    // Add your new template here
    case 'professional-services':
      return generateProfessionalServicesHTML(content, finalColors);
    
    default:
      return generateDefaultHTML(content, finalColors);
  }
}
```

### **Step 5: Test Your Template**

1. Restart dev server
2. Go to `/kit/[id]/website`
3. Your new template should appear!
4. Click it and generate
5. Test editing and export

---

## 🌐 **Alternative: GitHub Templates (For Variety)**

**When to use:**
- Want 100+ templates quickly
- Don't need heavy AI customization
- Users can edit manually

**How to add GitHub templates:**

```typescript
export const GITHUB_TEMPLATES: TemplateConfig[] = [
  {
    id: 'html5up-spectral',
    name: 'Spectral Landing',
    description: 'Responsive landing page from HTML5 UP',
    category: 'landing',
    source: 'github',
    githubUrl: 'https://github.com/CloudCannon/spectral-jekyll-template',
    defaultColors: {
      primary: '#5052b5',
      secondary: '#b74e91',
      accent: '#ec8d81',
      background: '#ffffff',
      text: '#000000',
    },
    sections: ['hero', 'features', 'cta', 'footer'],
  },
];
```

**Then fetch and adapt:**

```typescript
async function fetchGitHubTemplate(url: string): Promise<string> {
  // Fetch from GitHub
  const response = await fetch(url);
  let html = await response.text();
  
  // Make it editable
  html = html.replace(/<h1>/g, '<h1 contenteditable="true">');
  html = html.replace(/<p>/g, '<p contenteditable="true">');
  
  return html;
}
```

---

## 🎯 **Recommended Template Categories to Build**

### **Priority 1 (Most Needed):**
1. ✅ Modern Landing (done)
2. ✅ Minimal Portfolio (done)
3. **E-commerce Product** - For product launches
4. **SaaS Landing** - For software products
5. **Local Business** - For barbers, cafes, etc.

### **Priority 2 (Nice to Have):**
6. **Agency/Studio** - For creative agencies
7. **Restaurant/Cafe** - With menu sections
8. **Event/Conference** - With schedule
9. **Freelancer** - Single page portfolio
10. **App Landing** - Mobile app showcase

### **Priority 3 (Advanced):**
11. **Blog/Magazine** - Content-focused
12. **Nonprofit** - Donation-focused
13. **Real Estate** - Property listings
14. **Fitness/Gym** - Class schedules
15. **Medical/Dental** - Appointment booking

---

## 📐 **Template Best Practices**

### **1. Structure**
```html
<!-- Always use semantic HTML -->
<section data-section="hero">    <!-- For section management -->
  <h1 contenteditable="true"     <!-- For inline editing -->
      data-field="heading">      <!-- For tracking changes -->
    Content here
  </h1>
</section>
```

### **2. Styling**
```css
/* Use CSS variables for easy color changes */
:root {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
}

/* Mobile-first responsive */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
```

### **3. AI Content Placeholders**
```typescript
// Always provide fallbacks
businessName: kit.title || 'Your Business Name',
tagline: businessCase?.taglines?.[0] || 'Your tagline here',
features: businessCase?.offer_bullets || [
  'Default Feature 1',
  'Default Feature 2', 
  'Default Feature 3'
],
```

---

## 🚀 **Quick Template Starter**

Want to create a template fast? Use this starter:

```typescript
function generateYourTemplateHTML(content: any, colors: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.businessName}</title>
  <style>
    /* Your CSS here - use ${colors.primary} etc. */
  </style>
</head>
<body>
  <section data-section="hero">
    <h1 contenteditable="true">${content.businessName}</h1>
    <p contenteditable="true">${content.tagline}</p>
  </section>
  
  <section data-section="features">
    ${content.features.map((f: string, i: number) => `
      <div contenteditable="true">${f}</div>
    `).join('')}
  </section>
  
  <script>
    document.querySelectorAll('[contenteditable]').forEach(el => {
      el.addEventListener('blur', () => console.log('edited'));
    });
  </script>
</body>
</html>`;
}
```

---

## 💡 **Pro Tips**

### **Tip 1: Start with HTML5 UP**
Download a free template from https://html5up.net
- Strip out jQuery (keep it lightweight)
- Add `contenteditable` attributes
- Inject your color variables
- Convert to a template function

### **Tip 2: Use TailwindCSS Classes**
```html
<div class="bg-${colors.primary} text-white p-8">
  <!-- Much faster than writing custom CSS -->
</div>
```

### **Tip 3: Test with Real Data**
```typescript
const testContent = {
  businessName: 'Acme Consulting',
  tagline: 'Expert solutions for growing businesses',
  features: [
    'Strategic Planning',
    'Business Development', 
    'Market Research'
  ]
};
```

### **Tip 4: Version Control Templates**
```typescript
{
  id: 'modern-landing-v2',  // Create versions
  name: 'Modern Landing v2',
  // Allows A/B testing
}
```

---

## 🎨 **Template Gallery Ideas**

Create a template preview gallery:

```typescript
// In your template selection page
<div className="template-preview">
  <iframe 
    src={`/templates/preview/${template.id}`}
    style={{ transform: 'scale(0.5)' }}
  />
</div>
```

---

## 📊 **Metrics to Track**

Which templates are most popular?

```typescript
// Add to analytics
track('template_selected', {
  template_id: selectedTemplate,
  category: template.category,
  source: template.source
});
```

---

## ✅ **Checklist for New Template**

- [ ] Unique ID (kebab-case)
- [ ] Clear name and description
- [ ] Appropriate category
- [ ] 5 default colors defined
- [ ] Sections array listed
- [ ] Generator function created
- [ ] Registered in switch statement
- [ ] Mobile responsive
- [ ] contenteditable attributes added
- [ ] data-section attributes added
- [ ] Tested with real business data
- [ ] Tested export functionality
- [ ] Tested in editor
- [ ] Preview screenshot created

---

## 🚀 **Next Steps**

1. **Start with 1-2 templates** in categories you need
2. **Test thoroughly** with different business types
3. **Get user feedback** on what templates they want
4. **Add more gradually** based on demand
5. **Consider premium templates** as a revenue stream

---

**Remember:** Quality > Quantity. 4 amazing templates are better than 50 mediocre ones! 🎨

