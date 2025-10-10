# ✅ Website Builder - Testing Checklist

Use this checklist to verify everything works before launching.

---

## 🔧 Setup (One-Time)

### Database
- [ ] Run `database/add_website_support.sql` in Supabase SQL Editor
- [ ] Verify `websites` table exists
- [ ] Check RLS policies are enabled
- [ ] Test database connection

### Environment (Optional)
- [ ] Add `NETLIFY_AUTH_TOKEN` to `.env.local` (for one-click deploy)
- [ ] Restart dev server after adding env vars
- [ ] Verify env vars load correctly

---

## 🧪 Core Functionality

### Template Selection
- [ ] Navigate to dashboard
- [ ] Click "Create Website" button
- [ ] Template selection page loads
- [ ] All templates display with previews
- [ ] Can select a template (border highlights)
- [ ] "Generate Website" button appears when selected
- [ ] Button shows loading state when clicked

### Website Generation
- [ ] AI generates website (takes 2-5 seconds)
- [ ] Redirects to editor automatically
- [ ] HTML content populated correctly
- [ ] Business data appears in preview
- [ ] Colors match template defaults
- [ ] No errors in console

### Editor - Design Tab
- [ ] Editor loads with three tabs visible
- [ ] Design tab is active by default
- [ ] Color pickers display
- [ ] Can change primary color → preview updates
- [ ] Can change secondary color → preview updates
- [ ] Can change accent color → preview updates
- [ ] Can change background color → preview updates
- [ ] Can change text color → preview updates
- [ ] All color changes reflect immediately

### Editor - Preview
- [ ] Preview shows in iframe
- [ ] Content is editable (contentEditable)
- [ ] Click on heading → can edit text
- [ ] Click on paragraph → can edit text
- [ ] Click on button → can edit text
- [ ] Changes persist when clicking away
- [ ] No layout breaks when editing

### Editor - Toolbar
- [ ] Desktop view button works
- [ ] Mobile view button works
- [ ] Preview resizes correctly for mobile
- [ ] Undo button enabled after changes
- [ ] Undo reverts last change
- [ ] Redo button enabled after undo
- [ ] Redo reapplies change
- [ ] Save button works
- [ ] Save shows "Saving..." state
- [ ] Save confirms success

### Editor - Code Tab
- [ ] Switch to Code tab
- [ ] HTML displays correctly
- [ ] Can edit HTML directly
- [ ] Changes update preview
- [ ] Syntax looks correct (formatted)
- [ ] No security warnings

### Editor - Settings Tab
- [ ] Switch to Settings tab
- [ ] SEO fields visible
- [ ] Can enter website title
- [ ] Can enter meta description
- [ ] Deployment panel visible
- [ ] Export button visible
- [ ] Deploy button visible

---

## 📦 Export & Deploy

### Export HTML
- [ ] Click "Export HTML" button
- [ ] File downloads automatically
- [ ] Filename format: `website-[kitId].html`
- [ ] Open downloaded file → displays correctly
- [ ] All styles included
- [ ] No broken elements

### Export Package
- [ ] Click "Export Complete Package"
- [ ] Shows "coming soon" message (expected)
- [ ] No errors in console

### Netlify Deploy (if token set)
- [ ] Click "Deploy to Netlify"
- [ ] Shows deploying state
- [ ] Deployment completes (may take 30-60s)
- [ ] Success message shows
- [ ] URL displayed in green box
- [ ] Click URL → site loads
- [ ] Site looks identical to preview

### Netlify Deploy (no token)
- [ ] Click "Deploy to Netlify"
- [ ] Alert shows "not configured"
- [ ] Message explains setup needed
- [ ] No errors crash app

---

## 🔄 Multiple Websites

### Create Second Website
- [ ] Go back to `/kit/[id]/website`
- [ ] First website appears in "Your Websites"
- [ ] Can select different template
- [ ] Generate second website
- [ ] Both websites saved separately
- [ ] Can edit each independently

### Manage Existing
- [ ] Click existing website card
- [ ] Opens in editor
- [ ] Loads correct HTML
- [ ] Loads correct colors
- [ ] Can edit and save
- [ ] Version increments on save

---

## 🎨 Template Testing

### Modern Landing
- [ ] Generate with "Modern Landing"
- [ ] Hero section displays
- [ ] Features grid displays
- [ ] Footer displays
- [ ] Gradient background works
- [ ] Responsive on mobile

### Minimal Portfolio
- [ ] Generate with "Minimal Portfolio"
- [ ] Elegant typography displays
- [ ] Simple layout works
- [ ] Serif fonts load
- [ ] Content sections clear

### Bold Startup
- [ ] Generate with "Bold Startup"
- [ ] High-energy colors show
- [ ] Bold design apparent
- [ ] All sections present

### Luxury Brand
- [ ] Generate with "Luxury Brand"
- [ ] Premium feel achieved
- [ ] Sophisticated colors
- [ ] Elegant spacing

---

## 🐛 Error Handling

### No Business Case
- [ ] Create kit without business case
- [ ] Try to generate website
- [ ] Uses default placeholder content
- [ ] No errors occur
- [ ] Website still generates

### Invalid Kit ID
- [ ] Navigate to `/kit/invalid-id/website`
- [ ] Shows appropriate error
- [ ] Doesn't crash app
- [ ] Can navigate away

### Network Error
- [ ] Disable network
- [ ] Try to save website
- [ ] Shows error message
- [ ] Enables retry
- [ ] Reconnect and retry works

### Database Error
- [ ] Simulate DB error (disconnect)
- [ ] Try to load website
- [ ] Shows error message
- [ ] Doesn't crash app
- [ ] Reconnect works

---

## 📱 Mobile Testing

### Mobile Browser
- [ ] Open on mobile device
- [ ] Template selection works
- [ ] Can select template
- [ ] Generate button works
- [ ] Editor loads (may be cramped)
- [ ] Can switch tabs
- [ ] Preview visible
- [ ] Export works

### Tablet
- [ ] Open on tablet
- [ ] Full editor visible
- [ ] All controls accessible
- [ ] Preview adequate size
- [ ] Everything functional

---

## 🔒 Security

### RLS Policies
- [ ] Can only see own websites
- [ ] Can only edit own websites
- [ ] Can't access other users' websites
- [ ] Anonymous kits work correctly

### Content Safety
- [ ] Try injecting `<script>` tag
- [ ] Verify it's sanitized/removed
- [ ] Try other dangerous tags
- [ ] All blocked properly

### XSS Prevention
- [ ] Enter `<img onerror="alert('xss')">` in text
- [ ] Verify it doesn't execute
- [ ] Sanitization works

---

## ⚡ Performance

### Load Times
- [ ] Template selection < 2 seconds
- [ ] Website generation < 5 seconds
- [ ] Editor loads < 3 seconds
- [ ] Preview updates < 500ms
- [ ] Save completes < 2 seconds

### Memory
- [ ] Editor doesn't leak memory
- [ ] Multiple edits don't slow down
- [ ] Switching tabs smooth
- [ ] No lag when typing

---

## 🌐 Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Smooth performance

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Smooth performance

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Smooth performance

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Smooth performance

---

## 🔗 Integration

### Dashboard Integration
- [ ] Website card appears on dashboard
- [ ] Click opens template selection
- [ ] Returns to dashboard works
- [ ] No broken navigation

### Kit Integration
- [ ] Website uses kit data correctly
- [ ] Business name populates
- [ ] Tagline appears
- [ ] Features pull from business case
- [ ] Consistent branding

---

## 📊 Edge Cases

### Long Content
- [ ] Create kit with very long text
- [ ] Generate website
- [ ] Layout doesn't break
- [ ] Text wraps properly
- [ ] Scrolling works

### Special Characters
- [ ] Use special chars in business name: `&<>"'`
- [ ] Generate website
- [ ] Characters display correctly
- [ ] No encoding issues

### Missing Data
- [ ] Kit with no features
- [ ] Generate website
- [ ] Uses defaults gracefully
- [ ] No undefined errors

### Many Websites
- [ ] Create 10+ websites for one kit
- [ ] All display in list
- [ ] Can edit each
- [ ] Performance acceptable

---

## ✅ Final Checks

### Code Quality
- [ ] No TypeScript errors
- [ ] No linting warnings
- [ ] No console errors in production
- [ ] No console.log statements left

### User Experience
- [ ] Clear instructions visible
- [ ] Loading states obvious
- [ ] Error messages helpful
- [ ] Success feedback clear
- [ ] Overall flow intuitive

### Documentation
- [ ] Quick start guide accurate
- [ ] Full guide comprehensive
- [ ] Code examples work
- [ ] API docs correct

---

## 🚀 Ready to Launch?

If all checkboxes are ✅:
1. Commit your changes
2. Deploy to production
3. Announce the feature!
4. Monitor for issues

If any are ❌:
1. Note the failing test
2. Fix the issue
3. Re-test
4. Repeat until all pass

---

## 📝 Test Results

**Tester:** _______________
**Date:** _______________
**Environment:** _______________

**Overall Status:** 
- [ ] All tests passed
- [ ] Some tests failed (see notes)
- [ ] Blocked (can't proceed)

**Notes:**
```
[Add any issues or observations here]
```

---

**Good luck with testing! 🧪**

Report any bugs in the GitHub issues or project management tool.

