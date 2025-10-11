# Project 67 Specification vs Current Implementation

## Executive Summary

**Overall Assessment: ~45% Match**

The current LaunchKit AI implementation has good fundamentals but differs significantly from the Project 67 vision in user flow, tab structure, gating logic, and premium aesthetic. Major reconstruction needed for core journey and UI/UX.

---

## ✅ What We Got Right

### 1. **Technical Foundation (90% match)**
- ✅ Next.js 15 + TypeScript architecture
- ✅ Supabase database with proper RLS
- ✅ OpenAI GPT-4 integration
- ✅ Stripe payment integration (dual pricing)
- ✅ Modern component library structure
- ✅ PDF generation capability

### 2. **Content Generation (70% match)**
- ✅ Business Case generation exists
- ✅ Content Strategy generation exists
- ✅ Persona-based prompting system
- ✅ JSON-structured outputs
- ✅ Regeneration tracking in database

### 3. **Payment System (60% match)**
- ✅ £37 one-time payment option exists
- ✅ £1/day × 37 subscription concept exists
- ✅ Stripe checkout integration
- ✅ Webhook handling infrastructure

### 4. **Database Schema (75% match)**
- ✅ Users/profiles table
- ✅ Kits table with intake fields
- ✅ Outputs table with regeneration tracking
- ✅ Orders table for payments
- ✅ Anonymous kit creation support

---

## ❌ What's Missing or Wrong

### 1. **User Journey (20% match) - CRITICAL GAP**

**Spec Says:**
```
Landing → Progressive Entry → 3 Tabs (Business/Content/Website) 
→ First "Generate" forces signup → Complete all 3 tabs 
→ Checkout unlocks → Post-purchase dashboard
```

**Current Reality:**
```
Landing → Single form → Teaser → Auto-generate both 
→ Dashboard with no tab structure → No completion tracking
```

**Problems:**
- ❌ No 3-tab structure (Business Case / Content Strategy / Website)
- ❌ No progressive completion flow
- ❌ No "Complete" status tracking per tab
- ❌ No blocked checkout until 3 tabs are done
- ❌ No first-generate-triggers-signup pattern
- ❌ Auto-generation instead of user-controlled generation per tab
- ❌ Goes straight to dashboard instead of tab-by-tab completion

### 2. **Tab Logic & Limits (10% match) - CRITICAL GAP**

**Spec Requirements:**

| Tab | Pre-Checkout Regens | Post-Checkout Regens | Special Logic |
|-----|---------------------|----------------------|---------------|
| Business Case | 1 regeneration | Unlimited | "Incomplete Next Steps" generator always available |
| Content Strategy | 1 regeneration | Unlimited | Standard limits |
| Website | Unlimited | Unlimited | Design iteration needs unlimited |

**Current Reality:**
- ❌ No per-tab regeneration limits (currently global 3-regen cap)
- ❌ No differentiation between pre/post checkout limits
- ❌ No "Incomplete Next Steps" feature
- ❌ Website regeneration is not unlimited
- ❌ No checkout-status-aware limit changes

### 3. **Completion & Gating Rules (0% match) - CRITICAL GAP**

**Spec Requirements:**
- Tab marked "Complete" when user accepts output
- Checkout button disabled until 3/3 tabs complete
- Early checkout attempt → redirect to first incomplete tab with "You have 2/3 sections complete" message
- Clear visual progress indicator

**Current Reality:**
- ❌ No completion status tracking at all
- ❌ No checkout gating logic
- ❌ No incomplete tab detection
- ❌ No progress indicator (2/3 complete, etc.)
- ❌ Payment can happen before content generation

### 4. **Credits & Multi-Dashboard System (0% match) - CRITICAL GAP**

**Spec Requirements:**
- Credit packs: 500 credits for £6.99, 1000 for £12.99
- New dashboard costs 750 credits
- Each dashboard locked to specific business idea
- Credit balance tracking
- Upsell flow for new dashboards

**Current Reality:**
- ❌ No credits system at all
- ❌ No multi-dashboard support
- ❌ No idea locking per dashboard
- ❌ No credit purchase flow
- ❌ Users can only have one kit

### 5. **Premium Aesthetic (30% match) - MAJOR GAP**

**Spec Vision:**
- "Cinematic Apple-style feel"
- "Design.com-like interactivity"
- "Dark premium with soft whites and silvers"
- "Distinctive '67' accent that animates on load"
- "Calm confidence" tone
- "SF-like typography and Apple-grade polish"

**Current Reality:**
- ✅ Dark theme exists on homepage
- ✅ Some cinematic effects (orbs, parallax)
- ❌ Dashboard is basic light gray (not premium dark)
- ❌ No "67" branding element
- ❌ No Design.com-style interactive selectors
- ❌ Typography is standard, not SF Pro-like
- ❌ Tabs/cards feel basic, not cinematic
- ❌ No micro-animations or delightful interactions

### 6. **Website Tab (40% match) - PARTIAL**

**Spec Requirements:**
- 8 interactive templates in Design.com-style selector
- Unlimited regenerations pre and post checkout
- Part of required 3-tab completion

**Current Reality:**
- ✅ Website builder exists
- ✅ Template selection UI exists
- ✅ Visual editor works
- ❌ Not integrated into tab flow
- ❌ Accessed as separate journey from dashboard
- ❌ Not counted toward completion
- ❌ Not Design.com-style selector (more basic)

### 7. **Navigation & Tab Structure (5% match) - CRITICAL GAP**

**Spec Says:**
- Users can jump to any tab via top navigation
- But must complete all 3 before checkout
- Clear indication of which tabs are complete

**Current Reality:**
- ❌ No tabs at all
- ❌ Dashboard shows everything on one page
- ❌ No top navigation between sections
- ❌ Linear flow instead of non-linear exploration

### 8. **Microcopy & Trust Cues (40% match)**

**Spec Requirements:**
- "Expert-backed, optimized for maximum success"
- "No subscriptions, no hidden fees"
- "Focus over idea-hopping"
- "Welcome, your success awaits you"
- Friendly redirect text for incomplete flows
- Clear pre vs post-checkout regeneration labels

**Current Reality:**
- ✅ Some trust language on homepage
- ✅ "No hidden fees" messaging exists
- ❌ No "welcome" personalization
- ❌ No incomplete flow messaging (doesn't exist yet)
- ❌ Regeneration limits not clearly labeled as pre/post checkout
- ❌ "Focus over idea-hopping" message missing (no multi-dashboard yet)

### 9. **Hosting Upsell (0% match) - MISSING**

**Spec Requirements:**
- Optional £3/month hosting
- First 2 months free
- Presented at checkout

**Current Reality:**
- ❌ No hosting option at all
- ❌ No hosting-related database fields
- ❌ Not shown in checkout flow

### 10. **Authentication Flow (60% match)**

**Spec Requirements:**
- Anonymous browsing allowed
- First "Generate" click forces signup
- After login, continues generation
- Consumes free generations

**Current Reality:**
- ✅ Anonymous kit creation works
- ✅ Auth system built (AuthContext, signin/signup pages)
- ❌ No forced signup on first generate
- ❌ Generation happens without login in preview
- ⚠️ Free generation limits not tied to auth status

---

## 🔧 What Needs to Change

### Critical (Must Fix)

1. **Rebuild User Journey with 3-Tab Structure**
   - Create Business Case tab page
   - Create Content Strategy tab page  
   - Create Website tab page
   - Add tab navigation component
   - Implement "generate" button per tab (not auto-generate)
   - Track completion status per tab

2. **Implement Completion Tracking**
   - Add `tab_completion` table or columns
   - Mark tabs as "complete" when user accepts output
   - Show 2/3 progress indicators
   - Gate checkout until 3/3 complete

3. **Add Auth Gate on First Generate**
   - Detect if user is authenticated
   - Show signup modal on first "Generate" click
   - Resume generation after login

4. **Fix Regeneration Limits Per Tab**
   - Business Case: 1 pre-checkout, unlimited post
   - Content Strategy: 1 pre-checkout, unlimited post
   - Website: unlimited always
   - Check checkout status before applying limits

5. **Build Credits System**
   - Add `credits` table
   - Create credit purchase flow (£6.99/£12.99 packs)
   - Implement new dashboard creation (750 credits)
   - Lock each dashboard to its idea

6. **Premium Dark UI Overhaul**
   - Convert dashboard to dark theme
   - Add "67" animated accent
   - Implement Design.com-style template selector
   - Polish with micro-animations
   - Use SF-like fonts

### Important (High Priority)

7. **Hosting Option at Checkout**
   - Add hosting database fields
   - Create £3/month subscription product
   - Show in checkout UI

8. **Incomplete Flow Redirects**
   - Detect incomplete tabs on checkout attempt
   - Redirect to first incomplete
   - Show friendly "2/3 complete" message

9. **"Incomplete Next Steps" Generator**
   - Add dedicated Next Steps regeneration
   - Available even if case is complete
   - Unlimited uses

10. **Multi-Dashboard Support**
    - Add dashboard switcher UI
    - List all user dashboards
    - Enforce idea locking per dashboard

### Nice to Have (Lower Priority)

11. **Micro-copy Improvements**
    - Add all specified trust messages
    - Polish confirmation texts
    - Add "Welcome" personalization

12. **Progress Steps Component**
    - Visual indicator of journey stage
    - Show current step in process

---

## 📊 Detailed Gap Analysis by Feature

### State Machine Comparison

**Spec:**
```
Anonymous → Enters Idea → Clicks Generate on Any Tab → Auth Required Modal 
→ Signed-in Free Tier → Generates Per-Tab with Limits → Completes 3 Tabs 
→ Checkout → Unlocked → Unlimited Content + Expanded Next Steps 
→ Optional New Dashboard (750 credits)
```

**Current:**
```
Anonymous → Enters Idea → Teaser → Auto-generates Both 
→ Can access dashboard → No completion tracking → No credits
```

**Missing States:**
- Auth required modal on first generate
- Signed-in free tier with limits
- Tab-by-tab completion tracking
- Checkout gate (3/3 required)
- Post-checkout unlimited state
- Credit-based new dashboard creation

---

## 🎯 Recommended Implementation Order

### Phase 1: Core Journey (Week 1)
1. Create 3-tab structure pages
2. Add tab navigation component
3. Implement completion tracking
4. Add checkout gating logic
5. Fix regeneration limits per tab

### Phase 2: Auth & Credits (Week 2)
6. Add signup modal on first generate
7. Build credits system
8. Implement credit purchase flow
9. Enable multi-dashboard creation

### Phase 3: Polish & Premium (Week 3)
10. Dark premium UI overhaul
11. Add "67" branding
12. Design.com-style selectors
13. Micro-animations
14. SF-like typography

### Phase 4: Hosting & Final (Week 4)
15. Add hosting option
16. Polish incomplete flow redirects
17. Add "Incomplete Next Steps"
18. Final microcopy
19. Testing & bug fixes

---

## 💡 Key Acceptance Criteria Not Met

From the spec's "Key Acceptance Criteria" section:

1. ❌ "Users cannot reach checkout with fewer than 3 'Complete' states"
   - Currently no completion states exist

2. ❌ "First generate action always triggers sign up if not signed in"
   - Currently generation happens without auth

3. ❌ "Regeneration limits behave exactly as specified per tab before and after checkout"
   - Currently wrong limits (3-cap global instead of per-tab + checkout-aware)

4. ❌ "New dashboard creation deducts credits and locks to supplied idea immediately"
   - No credits system exists

5. ❌ "Dark, minimal, premium styling with SF-like typography and Apple-grade polish"
   - Dashboard is light gray, basic styling

6. ❌ "Interactions inspired by Design.com's snappy selectors"
   - Selectors are basic, not Design.com-style

---

## 🔄 Data Model Gaps

### Current Schema vs Required

**Missing Tables:**
- `credits` - user credit balance and transactions
- `tab_completion` - tracks which tabs are complete per kit
- `dashboards` - should be separate from `kits` for multi-dashboard support

**Missing Columns:**
- `kits.hosting_enabled` - for £3/month hosting option
- `kits.locked_idea` - to prevent changing idea per dashboard
- `kits.checkout_completed_at` - to differentiate pre/post checkout limits
- `outputs.tab_type` - should distinguish "Next Steps" from main Business Case

**Schema Changes Needed:**
```sql
-- Add credits system
CREATE TABLE credits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  balance INT DEFAULT 0,
  created_at TIMESTAMP
);

CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  amount INT, -- positive for purchase, negative for spend
  type TEXT CHECK (type IN ('purchase', 'spend')),
  description TEXT,
  created_at TIMESTAMP
);

-- Add tab completion tracking
CREATE TABLE tab_completions (
  id UUID PRIMARY KEY,
  kit_id UUID REFERENCES kits(id),
  tab_key TEXT CHECK (tab_key IN ('business_case', 'content_strategy', 'website')),
  is_complete BOOLEAN DEFAULT FALSE,
  chosen_output_id UUID REFERENCES outputs(id),
  completed_at TIMESTAMP
);

-- Add columns to kits
ALTER TABLE kits 
  ADD COLUMN checkout_completed_at TIMESTAMP,
  ADD COLUMN hosting_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN locked_idea TEXT; -- Store the original idea to prevent changes
```

---

## 🎨 Visual Design Gaps

### Homepage
- ✅ Dark cinematic feel (mostly there)
- ❌ Missing "67" animated accent on load
- ❌ Input box could be more Design.com-like

### Dashboard/Tabs
- ❌ Currently light gray - needs dark premium theme
- ❌ No cinematic card animations
- ❌ Basic layout - needs Apple-level polish
- ❌ No "67" branding anywhere
- ❌ No metallic accents

### Website Selector
- ⚠️ Exists but not Design.com-style
- ❌ Not 8 interactive templates shown at once
- ❌ No snappy hover interactions
- ❌ Not integrated into tab flow

### Typography
- ❌ Not SF Pro or SF-like
- ❌ Standard Next.js fonts
- Need: SF Pro Display for headings, SF Pro Text for body

### Color Palette
- Current: Blue/green accents, light gray backgrounds
- Needed: Dark base (#0a0a0a), soft whites, silvers, gold accent, "67" brand color

---

## 📝 Final Assessment

### What's Working Well:
1. Technical architecture is solid
2. AI generation produces good content
3. Payment infrastructure exists
4. Database foundation is good

### What Needs Urgent Attention:
1. **User journey is completely different** - needs full rebuild
2. **Tab structure doesn't exist** - core feature missing
3. **Completion tracking is absent** - cannot gate checkout
4. **Credits system missing** - no multi-dashboard support
5. **Premium aesthetic is basic** - needs significant polish

### Estimated Effort:
- **Current Match: 45%**
- **Rebuild Required: ~3-4 weeks**
- **Can Reuse: Database, API routes, AI integration, auth system**
- **Must Rebuild: User journey, tab structure, completion tracking, credits, UI polish**

### Recommendation:
The current implementation is a **strong foundation** but needs **significant restructuring** to match Project 67 spec. The good news: the hard parts (AI, payments, database) are done. The work ahead is primarily **UX flow reconstruction** and **premium UI polish**.

---

## 🚀 Next Steps

**Option A: Full Rebuild (Recommended)**
- Preserves current codebase as backup
- Build new tab-based journey from scratch
- Migrate good components over
- Timeline: 3-4 weeks to spec compliance

**Option B: Incremental Refactor**
- Gradually add tabs and completion tracking
- Risk of breaking existing flow
- Timeline: 4-5 weeks (slower due to compatibility concerns)

**Option C: Simplified Project 67**
- Remove multi-dashboard/credits features
- Keep 3-tab structure and completion tracking
- Simpler aesthetic (not full premium overhaul)
- Timeline: 2-3 weeks to MVP

---

**Generated:** October 11, 2025  
**Status:** Current implementation vs Project 67 spec comparison

