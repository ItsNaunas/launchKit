// Professional, highly customizable website templates
// These templates rival Wix, Webflow, and other premium builders

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

// Font families
const FONTS = {
  modern: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  classic: 'Georgia, "Times New Roman", serif',
  bold: '"Inter", "Helvetica Neue", Arial, sans-serif',
  elegant: '"Playfair Display", Georgia, serif',
};

// Generate premium Modern SaaS Landing template
export function generatePremiumModernLanding(
  content: any,
  colors: any,
  customization: TemplateCustomization = DEFAULT_CUSTOMIZATION
): string {
  const fontFamily = FONTS[customization.fontFamily];
  const maxWidth = customization.containerWidth === 'narrow' ? '960px' : 
                   customization.containerWidth === 'wide' ? '1400px' : 
                   customization.containerWidth === 'full' ? '100%' : '1200px';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.businessName} - ${content.tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-bg: ${colors.background};
      --color-text: ${colors.text};
      --font-main: ${fontFamily};
      --max-width: ${maxWidth};
      --radius: ${customization.borderRadius === 'none' ? '0' : 
                  customization.borderRadius === 'small' ? '4px' :
                  customization.borderRadius === 'large' ? '20px' : '12px'};
      --shadow: ${customization.shadows === 'none' ? 'none' :
                  customization.shadows === 'strong' ? '0 20px 60px rgba(0,0,0,0.3)' :
                  '0 10px 30px rgba(0,0,0,0.1)'};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: var(--font-main);
      line-height: 1.6;
      color: var(--color-text);
      background: var(--color-bg);
      overflow-x: hidden;
    }
    
    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 24px;
    }
    
    /* Navigation */
    nav {
      position: fixed;
      top: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      ${customization.animations ? 'transition: all 0.3s ease;' : ''}
    }
    
    nav .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-primary);
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 32px;
      list-style: none;
    }
    
    .nav-links a {
      color: var(--color-text);
      text-decoration: none;
      font-weight: 500;
      ${customization.animations ? 'transition: color 0.2s;' : ''}
    }
    
    .nav-links a:hover {
      color: var(--color-primary);
    }
    
    .nav-cta {
      padding: 12px 28px;
      background: var(--color-primary);
      color: white;
      border-radius: var(--radius);
      text-decoration: none;
      font-weight: 600;
      ${customization.animations ? 'transition: all 0.3s;' : ''}
    }
    
    .nav-cta:hover {
      background: var(--color-secondary);
      ${customization.animations ? 'transform: translateY(-2px);' : ''}
      box-shadow: var(--shadow);
    }
    
    /* Hero Section - Premium Design */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      position: relative;
      overflow: hidden;
      padding: 120px 24px 80px;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      ${customization.animations ? 'animation: drift 60s linear infinite;' : ''}
    }
    
    @keyframes drift {
      from { transform: translate(0, 0); }
      to { transform: translate(50px, 50px); }
    }
    
    .hero-content {
      position: relative;
      z-index: 10;
      text-align: center;
      max-width: 900px;
      color: white;
    }
    
    .hero-badge {
      display: inline-block;
      padding: 8px 20px;
      background: rgba(255,255,255,0.2);
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
    }
    
    .hero h1 {
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
      ${customization.animations ? 'animation: fadeInUp 0.6s ease-out;' : ''}
    }
    
    .hero p {
      font-size: clamp(1.1rem, 2vw, 1.4rem);
      line-height: 1.6;
      opacity: 0.95;
      margin-bottom: 40px;
      ${customization.animations ? 'animation: fadeInUp 0.6s ease-out 0.2s both;' : ''}
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .hero-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      ${customization.animations ? 'animation: fadeInUp 0.6s ease-out 0.4s both;' : ''}
    }
    
    .btn-primary {
      padding: 18px 40px;
      background: white;
      color: var(--color-primary);
      border-radius: var(--radius);
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      ${customization.animations ? 'transition: all 0.3s;' : ''}
      box-shadow: var(--shadow);
    }
    
    .btn-primary:hover {
      ${customization.animations ? 'transform: translateY(-3px);' : ''}
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    
    .btn-secondary {
      padding: 18px 40px;
      background: rgba(255,255,255,0.15);
      color: white;
      border: 2px solid white;
      border-radius: var(--radius);
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      backdrop-filter: blur(10px);
      ${customization.animations ? 'transition: all 0.3s;' : ''}
    }
    
    .btn-secondary:hover {
      background: rgba(255,255,255,0.25);
      ${customization.animations ? 'transform: translateY(-3px);' : ''}
    }
    
    /* Stats Section */
    .stats {
      background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
      padding: 80px 24px;
      color: white;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 48px;
      max-width: 1000px;
      margin: 0 auto;
      text-align: center;
    }
    
    .stat-item h3 {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 8px;
      ${customization.animations ? 'animation: countUp 2s ease-out;' : ''}
    }
    
    .stat-item p {
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    @keyframes countUp {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    
    /* Features Section - Premium Design */
    .features {
      padding: 120px 24px;
      background: #f9fafb;
    }
    
    .section-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 80px;
    }
    
    .section-badge {
      display: inline-block;
      padding: 6px 16px;
      background: var(--color-primary);
      color: white;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .section-header h2 {
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 16px;
      color: var(--color-text);
      letter-spacing: -0.02em;
    }
    
    .section-header p {
      font-size: 1.2rem;
      color: #6b7280;
      line-height: 1.6;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .feature-card {
      background: white;
      padding: 40px;
      border-radius: calc(var(--radius) * 2);
      box-shadow: var(--shadow);
      ${customization.animations ? 'transition: all 0.3s;' : ''}
      border: 1px solid rgba(0,0,0,0.05);
    }
    
    .feature-card:hover {
      ${customization.animations ? 'transform: translateY(-8px);' : ''}
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    }
    
    .feature-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border-radius: calc(var(--radius) * 1.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--color-text);
    }
    
    .feature-card p {
      color: #6b7280;
      line-height: 1.7;
      font-size: 1rem;
    }
    
    /* Testimonials Section */
    .testimonials {
      padding: 120px 24px;
      background: white;
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .testimonial-card {
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
      padding: 40px;
      border-radius: calc(var(--radius) * 2);
      border: 1px solid #e5e7eb;
      ${customization.animations ? 'transition: all 0.3s;' : ''}
    }
    
    .testimonial-card:hover {
      border-color: var(--color-primary);
      ${customization.animations ? 'transform: translateY(-4px);' : ''}
    }
    
    .testimonial-stars {
      color: #fbbf24;
      font-size: 1.2rem;
      margin-bottom: 16px;
    }
    
    .testimonial-text {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--color-text);
      margin-bottom: 24px;
      font-style: italic;
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .author-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.2rem;
    }
    
    .author-info h4 {
      font-weight: 600;
      color: var(--color-text);
    }
    
    .author-info p {
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      padding: 100px 24px;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
    }
    
    .cta-section::before {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
      border-radius: 50%;
      top: -250px;
      right: -250px;
    }
    
    .cta-content {
      position: relative;
      z-index: 10;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .cta-content h2 {
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 900;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }
    
    .cta-content p {
      font-size: 1.3rem;
      margin-bottom: 40px;
      opacity: 0.95;
    }
    
    /* Footer */
    footer {
      background: #1f2937;
      color: white;
      padding: 60px 24px 24px;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }
    
    .footer-column h3 {
      margin-bottom: 16px;
      font-weight: 700;
    }
    
    .footer-links {
      list-style: none;
    }
    
    .footer-links li {
      margin-bottom: 12px;
    }
    
    .footer-links a {
      color: #9ca3af;
      text-decoration: none;
      ${customization.animations ? 'transition: color 0.2s;' : ''}
    }
    
    .footer-links a:hover {
      color: white;
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #374151;
      color: #9ca3af;
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
      nav .nav-links {
        display: none;
      }
      
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .hero-buttons {
        flex-direction: column;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      
      .features-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  ${customization.showNav ? `
  <!-- Navigation -->
  <nav>
    <div class="container">
      <a href="#" class="logo" contenteditable="true">${content.businessName}</a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#pricing">Pricing</a>
      </div>
      <a href="#" class="nav-cta" contenteditable="true">Get Started</a>
    </div>
  </nav>
  ` : ''}
  
  <!-- Hero Section -->
  <section class="hero" data-section="hero">
    <div class="hero-content">
      <span class="hero-badge" contenteditable="true">✨ New Release</span>
      <h1 contenteditable="true" data-field="businessName">${content.businessName}</h1>
      <p contenteditable="true" data-field="tagline">${content.tagline}</p>
      <div class="hero-buttons">
        <a href="${content.ctaUrl || '#'}" class="btn-primary" contenteditable="true">${content.ctaText || 'Get Started Free'}</a>
        <a href="#features" class="btn-secondary">Learn More →</a>
      </div>
    </div>
  </section>
  
  ${customization.showStats ? `
  <!-- Stats Section -->
  <section class="stats" data-section="stats">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <h3 contenteditable="true">10K+</h3>
          <p contenteditable="true">Active Users</p>
        </div>
        <div class="stat-item">
          <h3 contenteditable="true">98%</h3>
          <p contenteditable="true">Satisfaction Rate</p>
        </div>
        <div class="stat-item">
          <h3 contenteditable="true">24/7</h3>
          <p contenteditable="true">Support Available</p>
        </div>
        <div class="stat-item">
          <h3 contenteditable="true">50M+</h3>
          <p contenteditable="true">Total Revenue</p>
        </div>
      </div>
    </div>
  </section>
  ` : ''}
  
  <!-- Features Section -->
  <section id="features" class="features" data-section="features">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">FEATURES</span>
        <h2 contenteditable="true">Everything you need to succeed</h2>
        <p contenteditable="true">Powerful features built for modern businesses</p>
      </div>
      <div class="features-grid">
        ${(content.features || ['Feature 1', 'Feature 2', 'Feature 3']).map((feature: string, i: number) => `
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3 contenteditable="true" data-field="feature-${i}-title">Amazing Feature ${i + 1}</h3>
            <p contenteditable="true" data-field="feature-${i}-description">${feature}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  
  ${customization.showTestimonials ? `
  <!-- Testimonials -->
  <section id="testimonials" class="testimonials" data-section="testimonials">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">TESTIMONIALS</span>
        <h2 contenteditable="true">Loved by thousands</h2>
        <p contenteditable="true">See what our customers have to say</p>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text" contenteditable="true">"This product completely transformed how we do business. Highly recommended!"</p>
          <div class="testimonial-author">
            <div class="author-avatar">JD</div>
            <div class="author-info">
              <h4 contenteditable="true">John Doe</h4>
              <p contenteditable="true">CEO, Tech Corp</p>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text" contenteditable="true">"Best decision we ever made. The ROI was incredible within the first month."</p>
          <div class="testimonial-author">
            <div class="author-avatar">SM</div>
            <div class="author-info">
              <h4 contenteditable="true">Sarah Miller</h4>
              <p contenteditable="true">Founder, StartupCo</p>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text" contenteditable="true">"Outstanding support and amazing features. Can't imagine working without it."</p>
          <div class="testimonial-author">
            <div class="author-avatar">MJ</div>
            <div class="author-info">
              <h4 contenteditable="true">Mike Johnson</h4>
              <p contenteditable="true">Director, Enterprise LLC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  ` : ''}
  
  <!-- CTA Section -->
  <section class="cta-section" data-section="cta">
    <div class="cta-content">
      <h2 contenteditable="true">Ready to get started?</h2>
      <p contenteditable="true">Join thousands of successful businesses today</p>
      <a href="#" class="btn-primary" contenteditable="true">Start Your Free Trial</a>
    </div>
  </section>
  
  <!-- Footer -->
  <footer data-section="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-column">
          <h3 contenteditable="true">${content.businessName}</h3>
          <p contenteditable="true">Building the future of business</p>
        </div>
        <div class="footer-column">
          <h3>Product</h3>
          <ul class="footer-links">
            <li><a href="#" contenteditable="true">Features</a></li>
            <li><a href="#" contenteditable="true">Pricing</a></li>
            <li><a href="#" contenteditable="true">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Company</h3>
          <ul class="footer-links">
            <li><a href="#" contenteditable="true">About</a></li>
            <li><a href="#" contenteditable="true">Blog</a></li>
            <li><a href="#" contenteditable="true">Careers</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Legal</h3>
          <ul class="footer-links">
            <li><a href="#" contenteditable="true">Privacy</a></li>
            <li><a href="#" contenteditable="true">Terms</a></li>
            <li><a href="#" contenteditable="true">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p contenteditable="true">© 2024 ${content.businessName}. All rights reserved.</p>
      </div>
    </div>
  </footer>
  
  <script>
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
          nav.style.boxShadow = 'none';
        }
      }
    });
  </script>
</body>
</html>`;
}

