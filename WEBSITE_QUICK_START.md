# 🚀 Website Builder - Quick Start Guide

Get your AI-powered website up and running in 5 minutes!

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Run Database Migration (1 minute)
```bash
# In Supabase SQL Editor, run:
database/add_website_support.sql
```

### Step 2: Generate Your Kit (Already Done!)
If you already have a kit with business case generated, skip to Step 3.

Otherwise:
1. Go to `/start`
2. Fill out intake form
3. Generate business case on dashboard

### Step 3: Create Website (2 minutes)
1. From your dashboard, click **"Create Website"**
2. Choose a template (we recommend "Modern Landing" to start)
3. Click **"Generate Website"**
4. Wait 5 seconds for AI to populate content

### Step 4: Customize (2 minutes)
The editor opens automatically:

1. **Change Colors**: Click color pickers in Design tab
2. **Edit Text**: Click any text in preview to edit
3. **Preview Mobile**: Click smartphone icon in toolbar
4. Click **Save**

### Step 5: Publish (30 seconds)
1. Go to **Settings** tab
2. Scroll to deployment section
3. Either:
   - Click **"Export HTML"** to download
   - Click **"Deploy to Netlify"** for one-click hosting

**Done! Your website is live! 🎉**

---

## 🎨 Customization Examples

### Change Brand Colors
```typescript
// In Design tab, update these:
Primary Color: #3b82f6 → Your brand color
Secondary Color: #8b5cf6 → Complementary color
Accent Color: #ec4899 → Highlight color
```

### Edit Content
Simply click on any text in the preview:
- Headlines
- Descriptions
- Button text
- Feature descriptions

### Advanced: Edit HTML
Switch to **Code** tab and edit the HTML directly:
```html
<h1>Your Business Name</h1>
<p>Your custom tagline here</p>
```

---

## 📦 What Gets Generated

Your website includes:
- ✅ Hero section with your business name and tagline
- ✅ Features section with your value propositions
- ✅ Professional styling matching your brand
- ✅ Mobile-responsive design
- ✅ SEO-friendly HTML structure
- ✅ Fast-loading, single-file HTML

---

## 🚢 Deployment Options

### Option 1: Netlify (Easiest)
**Requirements:** Netlify account (free)

1. Set `NETLIFY_AUTH_TOKEN` in `.env.local`
2. Click "Deploy to Netlify" in editor
3. Done! You get a live URL instantly

**Get token:** https://app.netlify.com/user/applications

### Option 2: Export & Upload
**Requirements:** Any web hosting

1. Click "Export HTML" in editor
2. Upload `website-[id].html` to your hosting:
   - GitHub Pages
   - Vercel
   - Cloudflare Pages
   - Any FTP server

### Option 3: Manual Deployment
**Requirements:** Developer knowledge

1. Click "Export Complete Package"
2. Get HTML, CSS, and config files
3. Customize further
4. Deploy anywhere you want

---

## 💡 Pro Tips

### Tip 1: Use Your Brand Colors
The AI pulls colors from your business case, but you can override:
1. Go to Design tab
2. Click color pickers
3. Match your existing brand guidelines

### Tip 2: Test Before Publishing
1. Click smartphone icon for mobile preview
2. Check all sections load correctly
3. Test links and buttons
4. Then deploy with confidence

### Tip 3: Create Multiple Versions
You can create multiple websites from one kit:
1. Generate website with "Modern Landing"
2. Go back to `/kit/[id]/website`
3. Generate another with "Minimal Portfolio"
4. Compare and choose your favorite!

### Tip 4: Keep a Backup
Before major changes:
1. Click "Export HTML"
2. Save the file
3. Make your changes
4. Rollback if needed by re-importing

### Tip 5: Add Custom Features
Export your HTML and add:
- Contact forms (Formspree, Tally)
- Chat widgets (Intercom, Crisp)
- Analytics (Google Analytics, Plausible)
- Custom JavaScript

---

## 🐛 Common Issues

### "Template not found"
**Solution:** Make sure you selected a template before generating

### "Website won't save"
**Solution:** 
1. Check browser console for errors
2. Verify database connection
3. Try exporting as backup

### "Colors not updating"
**Solution:**
1. Click Save after changing colors
2. Refresh preview
3. Check CSS in Code tab

### "Deploy fails"
**Solution:**
1. Check if `NETLIFY_AUTH_TOKEN` is set
2. Verify token is valid
3. Fall back to manual export

---

## 📚 Next Steps

### Beginner
- [x] Create your first website
- [ ] Customize colors to match your brand
- [ ] Deploy to Netlify
- [ ] Share your link!

### Intermediate
- [ ] Try different templates
- [ ] Edit HTML in Code tab
- [ ] Add custom CSS styling
- [ ] Set up custom domain

### Advanced
- [ ] Fork and modify templates
- [ ] Add new template to library
- [ ] Integrate with CMS
- [ ] Build multi-page site

---

## 🔗 Helpful Links

- [Full Documentation](WEBSITE_TEMPLATES_GUIDE.md)
- [Template Library](src/lib/website-templates.ts)
- [Editor Component](src/components/WebsiteEditor.tsx)
- [API Reference](src/app/api/kits/[id]/generate-website/route.ts)

---

## ❓ Need Help?

**Can't find something?**
Check the [full guide](WEBSITE_TEMPLATES_GUIDE.md)

**Found a bug?**
Open an issue with:
- What you were trying to do
- What happened
- Browser console errors

**Want to add a template?**
See [Contributing section](WEBSITE_TEMPLATES_GUIDE.md#contributing)

---

**🎉 Happy building! You've got this!**

Your website will be live in less time than it takes to make coffee ☕

