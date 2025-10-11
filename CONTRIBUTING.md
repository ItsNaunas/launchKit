# Contributing to LaunchKit AI

Welcome! This guide helps you navigate our codebase patterns and avoid common pitfalls.

---

## 🏗️ Development Setup

### Prerequisites
- Node.js 20+
- npm (package manager)
- Supabase account (for local dev)

### Quick Start
```bash
npm install
npm run dev        # Start dev server
npm run check      # Run typecheck + lint before commits
```

---

## 🔍 Code Patterns & Best Practices

### **Supabase Query Discipline**

Our TypeScript + Supabase setup requires careful query patterns to avoid type errors.

#### ✅ **DO: Use `.maybeSingle()` for Nullable Records**
```typescript
// When 0 rows is a valid state (e.g., user has no credits yet)
const { data: credits } = await supabase
  .from('credits')
  .select('balance')
  .eq('user_id', userId)
  .maybeSingle() as { data: { balance: number } | null; error: any };

const balance = credits?.balance ?? 0; // Safe with optional chaining
```

#### ✅ **DO: Select Exactly What You'll Access**
```typescript
// Select the specific columns you need
const { data: website } = await supabase
  .from('websites')
  .select('id, version, html_content') // ← Include all fields you'll use
  .eq('id', websiteId)
  .single();

// Now safe to access these properties
if (website) {
  const nextVersion = website.version + 1; // ✅ version was selected
}
```

#### ✅ **DO: Type Assert Before Property Access (When Needed)**
```typescript
// If you can't avoid .single() on possibly-empty results
const { data: existing } = await supabase
  .from('tab_completions')
  .select('*')
  .eq('kit_id', kitId)
  .single();

const record = existing as any; // Cast before accessing properties
if (record) {
  console.log(record.some_field); // ✅ Safe
}
```

#### ✅ **DO: Cast at Table Level for Insert/Update**
```typescript
// Standardized pattern for insert/update operations
const { data, error } = await (supabase
  .from('kits') as any)  // ← Cast here, at the table level
  .insert({
    title: 'My Kit',
    user_id: userId,
    // ... other fields
  })
  .select()
  .single();
```

#### ❌ **DON'T: Access Unselected Columns**
```typescript
// BAD: Only selected 'id' but trying to access 'version'
const { data } = await supabase
  .from('websites')
  .select('id')  // ← Only id!
  .single();

const ver = data.version; // ❌ TypeScript error + runtime undefined
```

#### ❌ **DON'T: Use Non-existent Helpers**
```typescript
// BAD: supabase.sql doesn't exist
.update({
  version: supabase.sql`version + 1`  // ❌ Will fail
})

// GOOD: Fetch current value, increment manually
const currentVersion = existing.version || 0;
.update({
  version: currentVersion + 1  // ✅ Works
})
```

---

### **React Hooks Hygiene**

#### ✅ **DO: Wrap Data-Fetching Functions in useCallback**
```typescript
const fetchData = useCallback(async () => {
  if (!user) return;
  
  const response = await fetch(`/api/data?userId=${user.id}`);
  const data = await response.json();
  setData(data);
}, [user]); // ← Include dependencies

useEffect(() => {
  fetchData();
}, [fetchData]); // ✅ Safe - fetchData is stable
```

#### ✅ **DO: Document eslint-disable Directives**
```typescript
useEffect(() => {
  initializeCanvas();
  return () => cleanup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ← Run once on mount; adding 'initializeCanvas' would cause re-init
```

**Required Justification Format:**
```typescript
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // [WHY SAFE]: Brief explanation of why this is intentionally empty/incomplete
```

#### ❌ **DON'T: Ignore Dependency Warnings Without Justification**
```typescript
// BAD: Silent disable without explanation
useEffect(() => {
  fetchUserData();
}, []); // Missing dep - why?
```

---

### **JSX Text & Entities**

#### ✅ **DO: Escape Quotes in JSX Text**
```typescript
// Use HTML entities
<p>Don&apos;t worry, we&apos;ve got you covered!</p>
<p>&quot;Quality first&quot; is our motto.</p>

// Or use template interpolation
<p>{`Don't worry, we've got you covered!`}</p>
```

#### ❌ **DON'T: Use Raw Quotes in JSX**
```typescript
// BAD: Will trigger ESLint errors in strict mode
<p>Don't do this</p>  // ❌
<p>"Quoted text"</p>  // ❌
```

---

### **TypeScript Strictness**

#### ✅ **DO: Prefer Explicit Types Over `any`**
```typescript
// When you must cast, be specific
interface Kit {
  id: string;
  title: string;
  has_access: boolean;
}

const kit = data as Kit; // ✅ Documents expected shape
```

#### ⚠️ **WHEN TO USE: `as any` (Escape Hatch)**

Acceptable cases:
1. **Supabase operations** where generic types collapse to `never`
2. **Third-party library** types are incorrect
3. **Gradual migration** from untyped to typed code

**Always include a comment:**
```typescript
const { data } = await (supabase.from('kits') as any) // Supabase generics issue
  .insert(newKit);
```

---

## 🚀 Pre-Commit Checklist

Before pushing code:

- [ ] Run `npm run check` (typecheck + lint)
- [ ] Build succeeds locally: `npm run build`
- [ ] No new `eslint-disable` comments without justification
- [ ] All `.select()` clauses include fields you access
- [ ] New `.single()` calls have error handling OR type assertion

---

## 🐛 Common Pitfalls

### **"Property does not exist on type 'never'"**

**Cause:** Supabase `.single()` result accessed without type assertion  
**Fix:** Add `const typed = data as any` before accessing properties

### **"Argument of type X is not assignable to parameter of type 'never'"**

**Cause:** Insert/update operation on Supabase without table-level cast  
**Fix:** Use pattern: `(supabase.from('table') as any).insert({...})`

### **React Hook Infinite Loops**

**Cause:** Adding function to deps that's redefined every render  
**Fix:** Wrap function in `useCallback` with its own deps

---

## 📚 Additional Resources

- [Next.js 15 App Router Docs](https://nextjs.org/docs)
- [Supabase JS Client v2](https://supabase.com/docs/reference/javascript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Getting Help

- Check existing patterns in similar API routes
- Review recent commits for type-safety fixes
- Ask in team chat before introducing new patterns

**Thank you for contributing to LaunchKit AI!** 🚀

