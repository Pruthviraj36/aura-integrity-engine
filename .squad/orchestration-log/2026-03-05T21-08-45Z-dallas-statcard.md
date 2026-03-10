# Dallas — StatCard Refactoring (Spawn 1)

**Timestamp:** 2026-03-05T21:08:45Z  
**Agent:** Dallas (Frontend Dev)  
**Task:** Refactor StatCard component — remove decorative effects, apply design tokens  
**Mode:** Sync  
**Priority:** HIGH

---

## Task Overview

Refactor `src/components/StatCard.tsx` to comply with Phase 4 design system:
- Remove `.glass-card`, `.aura-glow`, `.aura-text-glow` decorative classes
- Replace `hover:scale-[1.02]` with subtle `opacity-90` hover effect
- Update icon background from `bg-primary/10` → `bg-primary/8`
- Normalize spacing: `p-6` → `p-4` (align to 8px scale)
- Update title typography: `text-[10px] font-black` → `text-xs font-semibold`
- Update value typography: `text-3xl font-black` → `text-2xl font-bold`
- Apply semantic colors to trend (emerald/destructive already correct)
- Remove absolute positioned background gradient

**Expected Outcome:**
- StatCard passes TC-Color-003, TC-Spacing-001, TC-Typography-002, TC-Consistency-001 tests
- Component maintains all prop APIs and behavior
- Design system compliance checklist: 10/10 items passing
- Build succeeds with 0 errors

---

## Execution Status

**Status:** QUEUED FOR EXECUTION  
**Assigned to:** Dallas  
**Dependencies:** Phase 3 UI component customization (prerequisite work complete)  
**Blockers:** None

---

## Acceptance Criteria

- [ ] Component file updated: `src/components/StatCard.tsx`
- [ ] TypeScript: 0 errors (`npx tsc --noEmit`)
- [ ] Build: `npm run build` passes with 0 errors
- [ ] Tests: `npm run test -- design-system.test.tsx` shows improved passing rate
- [ ] Design tokens: 100% applied (no hardcoded px, colors, or spacing)
- [ ] Dark mode: colors auto-switch via CSS variables
- [ ] Responsive: styling works on mobile/tablet/desktop
- [ ] No prop/API changes

---

## Files to Modify

- `src/components/StatCard.tsx` (primary)

---

## Success Verification

Run after completion:
```bash
npm run build && npm run test -- design-system.test.tsx
```

Expected results:
- Build: 0 errors
- Tests: statcard-related failures reduced/resolved
