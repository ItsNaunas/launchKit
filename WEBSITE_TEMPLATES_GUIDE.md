# 🎨 Website Templates Feature - Complete Guide

## Overview

LaunchKit AI now includes a **powerful website builder** that creates custom websites using AI-powered content from your business data. Think of it as a simplified Wix-style editor with AI superpowers!

---

## ✨ Features

### 1. **AI-Powered Content Generation**
- Automatically populates templates with your business case data
- Uses your brand identity, taglines, and value propositions
- No manual content creation needed

### 2. **Multiple Template Options**
- **Built-in Templates**: 4 professionally designed templates
  - Modern Landing (SaaS/Digital Products)
  - Minimal Portfolio (Professionals/Creatives)
  - Bold Startup (Disruptive Brands)
  - Luxury Brand (Premium Products)
  
- **GitHub Templates**: Integration with popular open-source templates
  - HTML5 UP templates
  - Easily extensible to add more

### 3. **Visual Editor** (Wix-Style)
- **Live Preview**: See changes in real-time
- **Color Customization**: Change brand colors with color pickers
- **Text Editing**: Click to edit any text directly in preview
- **Responsive Views**: Preview desktop and mobile versions
- **Code Editor**: Advanced users can edit HTML directly
- **Undo/Redo**: Full history management

### 4. **Export & Deploy**
- **Export as HTML**: Download single-file website
- **Export Package**: Get HTML + CSS + config files
- **One-Click Deploy**: Deploy to Netlify instantly
- **Manual Deploy**: Instructions for Vercel, GitHub Pages, etc.

---

## 🚀 How to Use

### Step 1: Generate Your Launch Kit
1. Go to LaunchKit AI dashboard
2. Create your business case and content strategy
3. Let AI analyze your business

### Step 2: Choose a Template
1. From your dashboard, click **"Create Website"**
2. Browse available templates by category
3. Select your preferred template
4. Click **"Generate Website"**

### Step 3: Customize Your Website
The editor opens with three tabs:

#### **Design Tab**
- Adjust colors with color pickers
- Edit text directly in preview
- Manage sections (coming soon)

#### **Code Tab**
- Edit HTML directly
- Perfect for developers
- Full syntax control

#### **Settings Tab**
- Configure SEO settings
- Set meta descriptions
- Deploy or export your site

### Step 4: Publish
Choose your deployment method:
- **Netlify** (Recommended): One-click deploy, free hosting
- **Export HTML**: Download and upload anywhere
- **Export Package**: Get all files for custom deployment

---

## 🏗️ Technical Architecture

### Database Schema
```sql
-- New table: websites
CREATE TABLE websites (
  id uuid PRIMARY KEY,
  kit_id uuid REFERENCES kits(id),
  template_id text,
  template_source text, -- 'built-in' or 'github'
  html_content text,
  css_content text,
  config jsonb, -- Colors, fonts, settings
  sections jsonb, -- Section configuration
  deployed_url text,
  deploy_provider text,
  is_published boolean,
  version integer
);
```

### API Endpoints

#### Generate Website
```
POST /api/kits/[id]/generate-website
Body: { templateId: string, customColors?: object }
Response: { website: object, previewUrl: string }
```

#### Get Websites
```
GET /api/kits/[id]/generate-website
Response: { websites: array }
```

#### Update Website
```
PATCH /api/kits/[id]/websites/[websiteId]
Body: { html?, config?, css?, sections? }
Response: { website: object }
```

#### Deploy Website
```
POST /api/kits/[id]/websites/[websiteId]/deploy
Body: { provider: 'netlify' | 'vercel' }
Response: { url: string, provider: string }
```

#### Export Website
```
GET /api/kits/[id]/websites/[websiteId]/deploy
Response: { html, css, config, metadata }
```

### File Structure
```
src/
├── app/
│   ├── kit/[id]/
│   │   ├── website/
│   │   │   ├── page.tsx              # Template selection
│   │   │   └── [websiteId]/
│   │   │       └── page.tsx          # Editor page
│   └── api/
│       └── kits/[id]/
│           ├── generate-website/
│           │   └── route.ts          # Generate API
│           └── websites/[websiteId]/
│               ├── route.ts          # CRUD operations
│               └── deploy/
│                   └── route.ts      # Deploy API
├── components/
│   ├── WebsiteEditor.tsx             # Main editor component
│   └── DeploymentPanel.tsx           # Deploy UI
├── lib/
│   └── website-templates.ts          # Template library
└── database/
    └── add_website_support.sql       # Migration
```

---

## 🎨 Customization Levels

### Level 1: Basic (No Code)
- Choose template
- Change colors
- Edit text in preview
- One-click deploy

### Level 2: Intermediate (Some Code)
- Edit HTML in code tab
- Adjust CSS styling
- Modify sections
- Custom deployment

### Level 3: Advanced (Full Control)
- Fork template code
- Add custom sections
- Integrate with CMS
- Advanced deployment

---

## 🔧 Setup Instructions

### Database Migration
1. Open Supabase SQL Editor
2. Run `database/add_website_support.sql`
3. Verify `websites` table exists

### Environment Variables (Optional)
```env
# For Netlify deployment
NETLIFY_AUTH_TOKEN=your_netlify_token

# For Vercel deployment (coming soon)
VERCEL_TOKEN=your_vercel_token
```

### No Environment Variables?
- Users can still export HTML
- Manual deployment instructions provided
- No server-side deployment needed

---

## 📝 Adding New Templates

### Built-In Template
1. Open `src/lib/website-templates.ts`
2. Add to `BUILT_IN_TEMPLATES` array:
```typescript
{
  id: 'your-template-id',
  name: 'Your Template Name',
  description: 'Template description',
  category: 'landing', // or portfolio, business, etc.
  source: 'built-in',
  defaultColors: {
    primary: '#color',
    secondary: '#color',
    accent: '#color',
    background: '#color',
    text: '#color',
  },
  sections: ['hero', 'features', 'footer'],
}
```

3. Create generator function:
```typescript
function generateYourTemplateHTML(content: any, colors: any): string {
  return `<!DOCTYPE html>...`;
}
```

4. Add to switch statement in `generateTemplateHTML()`

### GitHub Template
1. Find a template repository (e.g., HTML5 UP)
2. Add to `GITHUB_TEMPLATES`:
```typescript
{
  id: 'github-template-id',
  name: 'GitHub Template Name',
  description: 'Template description',
  category: 'portfolio',
  source: 'github',
  githubUrl: 'https://github.com/user/repo',
  defaultColors: { ... },
  sections: [ ... ],
}
```

3. Fetch and adapt template in generation logic

---

## 🚢 Deployment Options

### Netlify (Recommended)
**Pros:**
- One-click deployment
- Free tier available
- Automatic SSL
- CDN included

**Setup:**
1. Get Netlify API token
2. Set `NETLIFY_AUTH_TOKEN` env var
3. Deploy from editor

### Vercel
**Pros:**
- Excellent performance
- Great developer experience

**Status:** Coming soon

### Manual Deployment
**Steps:**
1. Export HTML from editor
2. Upload to any hosting:
   - GitHub Pages
   - AWS S3
   - Cloudflare Pages
   - Any web server

---

## 🎯 Future Enhancements

### Phase 2 Features
- [ ] Drag-and-drop section builder
- [ ] Image upload and management
- [ ] Form builder integration
- [ ] Animation controls
- [ ] Custom domain setup

### Phase 3 Features
- [ ] Multi-page support
- [ ] Blog integration
- [ ] E-commerce components
- [ ] A/B testing
- [ ] Analytics integration

---

## 💡 Tips & Tricks

### Best Practices
1. **Start with a template** that matches your business type
2. **Use your brand colors** from business case
3. **Edit incrementally** - save often
4. **Test on mobile** before deploying
5. **Export a backup** before major changes

### Performance Tips
- Keep HTML lean and semantic
- Minimize inline styles
- Use system fonts for speed
- Optimize images before adding

### SEO Tips
- Fill in meta descriptions
- Use descriptive titles
- Structure with proper headings
- Add alt text to images

---

## 🐛 Troubleshooting

### Website won't generate
- Check if business case exists
- Verify kit ID is correct
- Check browser console for errors

### Editor not loading
- Clear browser cache
- Check internet connection
- Verify website ID in URL

### Deploy fails
- Verify environment variables set
- Check Netlify/Vercel tokens
- Fall back to manual export

### Changes not saving
- Check network tab for errors
- Verify database connection
- Try exporting as backup

---

## 📊 Comparison with Other Builders

| Feature | LaunchKit AI | Wix | Webflow | WordPress |
|---------|-------------|-----|---------|-----------|
| AI Content | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Code Export | ✅ Yes | ⚠️ Limited | ✅ Yes | ⚠️ Complex |
| Learning Curve | ✅ Easy | ✅ Easy | ❌ Hard | ⚠️ Medium |
| Customization | ⚠️ Medium | ⚠️ Medium | ✅ High | ✅ High |
| Hosting Included | ⚠️ Optional | ✅ Yes | ✅ Yes | ❌ No |
| Price | ✅ Free (beta) | 💰 $16/mo | 💰 $14/mo | ✅ Free |

---

## 🔗 Resources

- [Template Library](src/lib/website-templates.ts)
- [Editor Component](src/components/WebsiteEditor.tsx)
- [API Documentation](src/app/api/kits/[id]/generate-website/route.ts)
- [Database Schema](database/add_website_support.sql)

---

## 🤝 Contributing

Want to add more templates?
1. Fork the repo
2. Add your template to `website-templates.ts`
3. Test with dummy data
4. Submit a PR

---

## ❓ FAQ

**Q: Can I use my own domain?**
A: Yes! Export HTML and deploy to any hosting with custom domain support.

**Q: Is the code clean/production-ready?**
A: Yes! Generated HTML is semantic and follows best practices.

**Q: Can I edit after deploying?**
A: Yes! Update in editor and redeploy, or download new version.

**Q: What if I need custom functionality?**
A: Export code and add custom JavaScript/features manually.

**Q: Is this better than hiring a developer?**
A: For simple landing pages, yes! For complex apps, hire a developer.

---

**🎉 You're ready to build amazing websites with AI!**

Need help? Check the troubleshooting section or contact support.

