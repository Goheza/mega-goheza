# Plan — Platform-Wide Refinements + Admin Dashboard

This is a large, multi-area build. Grouped into 4 shippable parts. All frontend/mock-data; no backend changes.

---

## PART A — Brand Campaign System Improvements

### A1. Campaign Creation (`brand.create.$type.tsx`)
- **Country targeting step**: Global vs Specific Countries (multi-select chips: UG, KE, NG, ZA, GH, TZ, RW, ET, EG, MA, CI, SN, CM, DRC). Applies to all 4 active types.
- **Min duration = 30 days** enforced on duration selector (7/14 removed; presets become 30/60/90/Custom with min=30).
- **Do's & Don'ts UI**: dual-pane structured editor. Green check cards (Do's), red warning cards (Don'ts). Add/remove rows, optional example field per row.
- **Full pricing model**:
  - Creator Budget = Creators × Max Pay
  - Performance Budget = (Expected Views ÷ 1000) × Reward per 1K
  - Subtotal = Creator + Performance
  - Platform Fee = Subtotal × 15%
  - Total = Subtotal + Fee
  - Live breakdown panel sticky on the right.

### A2. Campaign Management Page (FIX broken "Manage Campaign" button)
- `brand.campaigns.$id.tsx` exists but needs to be wired from list. Verify link and expand to include all required tabs: Overview, Budget Breakdown, Submissions, Approved Videos, Analytics Preview, Wallet Spend, Timeline, Edit (limited), Pause/Resume.
- Add Pause/Resume state toggle (local state mutation on mock).

### A3. Brand Submissions (`brand.submissions.tsx`)
- Restructure: Accordion/grouped by Campaign. Each campaign card shows pending count, expand to list submissions. Per-group status filter chips.
- Keep existing 2× submission cap and approval cap logic.

### A4. Brand Analytics (`brand.analytics.tsx`)
- Two-level flow: campaign picker grid → per-campaign deep analytics (Views, Likes, Comments, Shares, ER, Watch Time, Demographics: age/gender/location, Traffic Source, Peak Times).
- Video-level table with platform link, metrics, CPM, ROI, filter chips (All/Platform/Performance).

### A5. Brand Wallet (`brand.wallet.tsx`)
- Remove "Platform Fees" card from top breakdown.
- Make "Reserved Budget" and "Remaining Budget" cards expandable (collapsible) showing per-campaign allocation, spent, remaining, upcoming deductions.

---

## PART B — Creator-Side & Landing Fixes

### B1. Creator campaign browser
- Add country filter chip row to `creator.campaigns.tsx`.

### B2. Audience toggle z-index fix
- `AudienceBar.tsx`: raise z-index above nav, adjust spacing, ensure visible across breakpoints.

### B3. Nav Login button styling
- Update `Nav.tsx`: Log In becomes a subtle outlined/ghost pill — more prominent than nav links, less than primary CTA. Consistent on mobile menu.

### B4. Testimonials mobile fix
- `Testimonials.tsx` Creator marquee: constrain card widths on mobile, prevent overlap/overflow, keep marquee animation.

---

## PART C — Admin Dashboard (NEW `/admin`)

New top-level dashboard mirroring Brand/Creator architecture.

### Files
- `src/components/admin/admin-data.ts` — types + mocks for platform overview, activity feed, all campaigns, all submissions, brand wallets, creator wallets, invoices, support tickets, users (brands+creators), disputes, platform settings, admin notifications.
- `src/components/admin/admin-ui.tsx` — re-exports + Admin-specific cards (MetricCard, ActivityRow, ModerationActions, DisputeCard).
- `src/routes/admin.tsx` — layout with sidebar + topbar + notification panel.
- `src/routes/admin.index.tsx` — overview: 9 metric cards + live activity feed.
- `src/routes/admin.campaigns.tsx` — global campaign list with filters.
- `src/routes/admin.campaigns.$id.tsx` — campaign detail with admin actions (pause, edit, force approve/reject, refund, extend, close early).
- `src/routes/admin.submissions.tsx` — global submissions feed with filters + moderation actions.
- `src/routes/admin.wallets.tsx` — global financial overview + tabs for Brand Wallets / Creator Wallets.
- `src/routes/admin.invoices.tsx` — invoice queue with actions.
- `src/routes/admin.support.tsx` — ticket list + filter; detail in side panel.
- `src/routes/admin.users.tsx` — Creators / Brands tabs with profile actions.
- `src/routes/admin.analytics.tsx` — Growth / Financial / Content tabs.
- `src/routes/admin.disputes.tsx` — dispute resolution interface.
- `src/routes/admin.settings.tsx` — platform config (min duration, fees, countries, payment rules).

Sidebar: Overview, Campaigns, Submissions, Wallets, Invoices, Support, Users, Analytics, Disputes, Settings, Logout.

### Access
- Add `/admin` link from `/get-started` page (small "Admin" link at bottom). All mock — no auth gating.

---

## PART D — Global Responsiveness Pass

Walk-through to verify and patch:
- All admin pages mobile-first (tables → cards <md).
- Brand wallet expandables work on mobile.
- New campaign create panels stack on mobile.
- Submissions accordion full-width on mobile.

---

## Out of Scope
- Real backend, real auth, real payments.
- Replacing existing creator dashboard structure beyond fixes listed.

Approx. 14 new files, ~10 edited files. Pure presentation with mock data.