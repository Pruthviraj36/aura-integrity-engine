# Dallas — StatusBadge Refactoring (Spawn 2)

**Timestamp:** 2026-03-05T21:08:45Z  
**Agent:** Dallas (Frontend Dev)  
**Task:** Refactor StatusBadge component — update padding, add focus states  
**Mode:** Sync  
**Priority:** MEDIUM

---

## Task Overview

Refactor `src/components/StatusBadge.tsx` to comply with Phase 4 design system:
- Verify semantic color tokens applied (present→success, late→warning, absent→error)
- Update padding: `px-2.5 py-0.5` → `px-3 py-1` (normalize to 4px multiples)
- Update font: `text-xs font-medium` → `text-xs font-semibold`
- Add focus state: `focus:ring-2 focus:ring-offset-2` for keyboard navigation
- Verify dark mode contrast (WCAG AA, 4.5:1 text)
- Ensure component aligns to 10-item design system checklist

**Expected Outcome:**
- StatusBadge passes TC-Color-003, TC-Spacing-003, TC-Consistency-004 tests
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

- [ ] Component file updated: `src/components/StatusBadge.tsx`
- [ ] Semantic colors verified: success, warning, error (emerald, amber, red)
- [ ] Padding normalized: px-3 py-1 applied
- [ ] Font weight updated: font-semibold
- [ ] Focus ring added: focus:ring-2 focus:ring-offset-2
- [ ] TypeScript: 0 errors (`npx tsc --noEmit`)
- [ ] Build: `npm run build` passes with 0 errors
- [ ] Tests: `npm run test -- design-system.test.tsx` shows improved passing rate
- [ ] Dark mode: contrast verified ≥4.5:1 for text
- [ ] No prop/API changes

---

## Files to Modify

- `src/components/StatusBadge.tsx` (primary)

---

## Success Verification

Run after completion:
```bash
npm run build && npm run test -- design-system.test.tsx
```

Expected results:
- Build: 0 errors
- Tests: statusbadge-related failures reduced/resolved
- Manual dark mode check: text readable on dark background
