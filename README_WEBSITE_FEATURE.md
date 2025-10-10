# 🎨 Website Templates Feature

## Quick Overview

LaunchKit AI now includes an **AI-Powered Website Builder** that creates professional websites using your business data. It's like Wix, but powered by AI!

---

## ⚡ Quick Start

1. **Run Database Migration**
   ```bash
   # In Supabase SQL Editor
   Run: database/add_website_support.sql
   ```

2. **Create a Website**
   - Go to your dashboard
   - Click "Create Website"
   - Choose a template
   - AI generates your site!

3. **Customize & Deploy**
   - Edit colors and text
   - Preview on mobile
   - Export or deploy to Netlify

---

## ✨ Key Features

### 🤖 AI-Powered Generation
- Automatically uses your business case data
- Populates templates with your content
- No manual content creation needed

### 🎨 Visual Editor
- Live preview (desktop & mobile)
- Click-to-edit text
- Color customization
- Undo/Redo support
- Code editor for advanced users

### 📦 Export & Deploy
- Export as HTML (single file)
- One-click Netlify deployment
- Manual deployment guides
- Full code ownership

### 🖼️ Templates
- **Modern Landing** - SaaS/Digital
- **Minimal Portfolio** - Professional
- **Bold Startup** - Disruptive
- **Luxury Brand** - Premium
- + GitHub templates integration

---

## 📚 Documentation

- **[Full Guide](WEBSITE_TEMPLATES_GUIDE.md)** - Complete documentation
- **[Quick Start](WEBSITE_QUICK_START.md)** - 5-minute tutorial
- **[Implementation](WEBSITE_IMPLEMENTATION_SUMMARY.md)** - Technical details

---

## 🏗️ Architecture

### Files Created
```
database/
  └── add_website_support.sql          # Migration

src/
  ├── app/
  │   ├── kit/[id]/website/
  │   │   ├── page.tsx                 # Template selection
  │   │   └── [websiteId]/page.tsx     # Editor
  │   └── api/kits/[id]/
  │       ├── generate-website/        # Generate API
  │       └── websites/[websiteId]/    # CRUD & Deploy
  ├── components/
  │   ├── WebsiteEditor.tsx            # Main editor
  │   └── DeploymentPanel.tsx          # Deploy UI
  └── lib/
      ├── website-templates.ts         # Templates
      └── template-helpers.ts          # Utilities
```

### API Endpoints
- `POST /api/kits/[id]/generate-website` - Generate
- `GET /api/kits/[id]/generate-website` - List
- `PATCH /api/kits/[id]/websites/[id]` - Update
- `POST /api/kits/[id]/websites/[id]/deploy` - Deploy
- `GET /api/kits/[id]/websites/[id]/deploy` - Export

---

## 🚀 Usage Example

```typescript
// 1. User clicks "Create Website"
// 2. Selects template: "modern-landing"
// 3. AI extracts content from business case:
{
  businessName: "My SaaS",
  tagline: "AI-powered solution",
  features: ["Fast", "Secure", "Scalable"]
}

// 4. Generates HTML with template
const website = await generateWebsite(templateId, content);

// 5. User customizes in editor
// 6. Exports or deploys!
```

---

## 🔧 Setup

### Required
```bash
# 1. Database migration
Run in Supabase: database/add_website_support.sql

# 2. No code changes needed!
# Everything is already integrated
```

### Optional (for Netlify deploy)
```bash
# .env.local
NETLIFY_AUTH_TOKEN=your_token_here
```

---

## 🎯 Customization Levels

| Level | Skills | Features | Time |
|-------|--------|----------|------|
| Basic | None | Templates, colors, text | 5 min |
| Intermediate | Some HTML | Code editing, custom CSS | 30 min |
| Advanced | Developer | Custom templates, features | 2+ hrs |

---

## 💡 Examples

### Change Colors
```typescript
// In editor Design tab
primary: '#3b82f6' → '#yourcolor'
```

### Edit Content
```html
<!-- Click in preview to edit -->
<h1>Your Business Name</h1>
<p>Your tagline here</p>
```

### Add New Template
```typescript
// In website-templates.ts
{
  id: 'my-template',
  name: 'My Template',
  // ... config
}
```

---

## 📊 Comparison

| Feature | LaunchKit | Wix | Webflow | WordPress |
|---------|-----------|-----|---------|-----------|
| AI Content | ✅ | ❌ | ❌ | ❌ |
| Code Export | ✅ | ⚠️ | ✅ | ⚠️ |
| Free Tier | ✅ | ⚠️ | ⚠️ | ✅ |
| Learning Curve | Easy | Easy | Hard | Medium |

---

## 🚢 Deployment

### Netlify (One-Click)
1. Set `NETLIFY_AUTH_TOKEN`
2. Click "Deploy to Netlify"
3. Done! ✨

### Manual Export
1. Click "Export HTML"
2. Upload to any hosting:
   - GitHub Pages
   - Vercel
   - Cloudflare Pages
   - Your own server

---

## 🐛 Troubleshooting

**Website won't generate?**
- Check if business case exists
- Verify kit ID
- Check console for errors

**Editor not loading?**
- Clear cache
- Check internet
- Verify website ID in URL

**Deploy fails?**
- Check Netlify token
- Use export as fallback

---

## 🔮 Roadmap

### Coming Soon
- [ ] Drag-and-drop sections
- [ ] Image upload
- [ ] Form builder
- [ ] More templates
- [ ] Multi-page support

### Long-term
- [ ] E-commerce components
- [ ] Blog integration
- [ ] Analytics dashboard
- [ ] Template marketplace

---

## 📝 Adding Templates

### 1. Define Config
```typescript
{
  id: 'new-template',
  name: 'New Template',
  category: 'landing',
  defaultColors: { ... },
  sections: ['hero', 'features']
}
```

### 2. Create Generator
```typescript
function generateNewTemplate(content, colors) {
  return `<!DOCTYPE html>...`;
}
```

### 3. Test
```bash
npm run dev
# Test generation
# Verify editor works
```

---

## 🎓 Learn More

- [Architecture Overview](WEBSITE_IMPLEMENTATION_SUMMARY.md)
- [Template System](src/lib/website-templates.ts)
- [Editor Component](src/components/WebsiteEditor.tsx)
- [API Routes](src/app/api/kits/[id]/generate-website/)

---

## 🙏 Acknowledgments

Built with:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Supabase

Inspired by:
- Wix Editor
- Webflow
- Canva

---

## ✅ Status

**Current:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** October 10, 2025

---

**🎉 Start building websites with AI today!**

Check the [Quick Start Guide](WEBSITE_QUICK_START.md) to create your first website in 5 minutes.

