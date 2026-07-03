# Implementation Plan — Lexora AI Employee Portal

_Verification of the design handoff (`design_handoff_employee_portal/`) against this
repository, plus a phased plan to build the full portal._

Status of the baseline (verified 2026-07-03): the app **builds cleanly**
(`npm run build` ✓) and ships three routes — `/` (name + email sign-in),
`/profile`, `/logout` — backed by a **signed HTTP-only cookie** (`lib/session.ts`),
**no database**. This is the intentional "works the moment it's deployed"
placeholder described in `README.md`.

---

## 1. Plan verification — where the handoff does NOT match this repo

The handoff is high quality, but it was written for a **different target** and makes
assumptions that are false here. These must be resolved before the plan is buildable.

| # | Handoff assumption | Reality in this repo | Consequence |
|---|--------------------|----------------------|-------------|
| V1 | Target codebase is `bsgusa/lexoraai-admin` — **React + Vite + react-router**; extend the existing `EmployeeLayout`, `src/pages/employee/*` shell. | This repo is **Next.js 15 App Router + TypeScript + Tailwind**. No such shell exists. | The "extend the shell" instruction cannot be followed. The shell (sidebar, top bar, layout) must be **built fresh** as App-Router route groups. |
| V2 | Reuse existing `LexoraLogo`, `Button`, `RequirePermission` components and `AuthContext`. | None exist. | All of these must be **created** in this repo. The prototype's inline SVG logo is the reference for `LexoraLogo`. |
| V3 | "Repo already has Supabase/API patterns — persist there." | **No database, no ORM, no API layer.** State lives only in a per-browser cookie. | A **data layer is a hard prerequisite** for almost every screen. Approvals, shared announcements, directory, CRM, realtime signups are impossible with per-browser state. This is the biggest gap. |
| V4 | Email-based login (magic link or password) "per repo's existing auth". | Auth is name + email with **no password, no verification, no roles**. Anyone can type any name/email. | Real **authentication + authorization** must be added. Roles (Super Admin / HR / Employee) and the pending→approved gate depend on it. |
| V5 | "New signups appear here in realtime"; shared clock state across widgets. | No server push; cookie is single-browser. | Needs a server data source + **realtime (Supabase realtime / SSE / polling)**. Cross-widget clock state is fine in-client, but must persist server-side to survive reloads. |
| V6 | Super Admin = "the account owner"; Mounika Ampelli = HR Admin. | No concept of an owner or of Mounika. | Need a way to **designate** the owner + Mounika (env var / seed row), and to map an authenticated identity to a role. |
| V7 | Lexora Assistant answers canned FAQs in the prototype; production "should call a real model". | No AI integration. | Wire to the **Claude API** (`claude-opus-4-8` / a Claude model) with a KB fallback. Requires a server route + key. |

**Bottom line:** the handoff is a solid _design_ spec but not a buildable _engineering_
plan for this repo as-is. Items **V3 and V4 (data + auth) are blocking** — nothing beyond
the current two screens can be built meaningfully without them.

---

## 2. Foundational decisions to confirm before Phase 1

These are the open questions the handoff leaves unanswered for this stack. Recommended
defaults are given; confirm or override.

1. **Data + auth backend.** Recommended: **Supabase** (Postgres + Auth + Realtime + RLS) —
   it satisfies V3, V4, V5, V6 in one dependency, matches what the handoff already
   assumed, and has a first-class Next.js App Router SDK. Alternative: Postgres (Neon)
   + Auth.js. Deciding this unblocks everything else.
2. **Auth method.** Recommended: **magic-link email** (passwordless) via Supabase Auth —
   keeps the "just your work email" feel of the current app while adding real identity.
3. **Role assignment.** Owner (Super Admin) and Mounika's HR email set via **env vars**
   (`SUPER_ADMIN_EMAIL`, `HR_ADMIN_EMAIL`); everyone else defaults to Employee, pending
   approval. Store role on the `users` row; enforce with RLS + server checks.
4. **Realtime.** Supabase realtime channels for Onboarding Approvals and the announcements
   feed; polling fallback elsewhere.
5. **AI assistant.** Claude API via a server route; fall back to "flagged for HR → added
   to Knowledge Book" when no confident answer. Needs `ANTHROPIC_API_KEY`.
6. **Domain.** Deploy as its own Vercel project; suggested `portal.lexoraai.com`.

---

## 3. Data model (target — Supabase/Postgres)

Derived from the handoff's "State Management" section.

- `users` — id, email (unique), full_name, dept, title, employment_type, status
  (`pending|approved|rejected`), role (`super_admin|hr_admin|employee`), created_at.
- `time_entries` — id, user_id, date, hours (numeric, 0.25 step), project, notes,
  clock_in_at, clock_out_at.
- `leaves` — id, user_id, type (`pto|sick|unpaid|other`), start_date, end_date, note,
  status (`pending|approved|denied`).
- `announcements` — id, title, body, tag (`company|payroll|product|hr`), pinned, author_id,
  created_at.
- `tasks` — id, user_id, title, project, due, priority (`high|med|low`), done.
- `wellbeing_questions` — id, question, answer, anonymous, from_user_id, answered_by,
  created_at, answered_at.
- `faqs` — id, category, question, answer, created_at.
- `paystubs` — id, user_id, period, paid_date, hours, gross, net, pdf_url.
- CRM: `leads`, `opportunities`, `marketing_posts`, `investors` — each with a `status`
  enum per the handoff's status sets, plus title/meta/value/body/score/date fields.

All tables get **row-level security**: employees read/write their own rows; HR/Super Admin
get broader read/write per the roles matrix; CRM is read-only for employees.

---

## 4. Phased build

Each phase is independently shippable and leaves `npm run build` green.

### Phase 0 — Foundations (blocking; V1–V4, V6)
- Add Supabase (or chosen backend); env wiring; migrations for the schema above + RLS.
- Real auth: magic-link sign-in replacing the current cookie flow (keep the same
  minimal look). Seed Super Admin + Mounika from env.
- `AuthContext`/server helpers exposing `{ user, role, status }`; a `RequireRole`
  gate; `LexoraLogo` component (port the prototype SVG).
- **App shell** as an App-Router layout: 256px sidebar (Workspace + Growth·CRM nav
  groups, admin-only items gated), 56px top bar with the live clock-in widget, toast
  system. Route group `app/(portal)/*`.
- Onboarding **pending** screen for unapproved users.
- _Exit:_ a real user can sign in, land in a gated shell, and see a pending state until approved.

### Phase 1 — Core employee workflow
- **Dashboard** (greeting, 4 stat cards, two-column announcements/leave + hours/quick links).
- **Time Tracking** (lobby clock banner, log-time form, recent entries; clock-out auto-creates
  a rounded entry; shared state with the top-bar widget).
- **Leave Requests** (new-request form + my/all requests list).
- **Tasks** (add/toggle/priority).
- _Exit:_ an approved employee can track time, request leave, manage tasks.

### Phase 2 — Admin + communications
- **Onboarding Approvals** (admin only; approve/reject; realtime new signups).
- **Announcements** (admin compose + pinned/tagged feed).
- **Directory** (people grid from `users`).
- **Employee Wellbeing** (ask anonymously; Mounika replies).
- _Exit:_ Mounika can run onboarding, post announcements, answer wellbeing questions.

### Phase 3 — Payroll, documents, knowledge
- **Payroll** (stat cards + pay-stub table; PDF links; placeholder→real data).
- **Documents & Policies** (file grid + downloads; storage bucket).
- **Knowledge Book** (FAQ accordion + admin "add FAQ").
- _Exit:_ read-heavy reference screens live.

### Phase 4 — Growth / CRM
- Shared CRM layout (filter chips + search + card grid) reused across **Leads,
  Opportunities, Marketing, Investors** with per-collection status sets/colors.
- Admin status `<select>`; employee read-only pill.
- _Exit:_ all four CRM screens live with correct role gating.

### Phase 5 — Lexora Assistant (AI)
- Right slide-over chat; server route calling the Claude API; KB fallback + "flagged for HR".
- _Exit:_ working AI panel with graceful fallback.

### Phase 6 — Polish
- Toasts on every mutation, hover states, keyboard submit (Enter), pixel pass against the
  prototype using the existing Tailwind tokens, a11y, empty/loading states, seed data.

---

## 5. Design system status

Good news: the Tailwind tokens, `.card`/`.btn-primary`/`.input`/`.pill` classes, fonts
(Inter + Sora), and color palette in `tailwind.config.ts` + `app/globals.css` **already
match the handoff's design tokens**. The visual foundation is in place; the work is
components, screens, roles, and data — not re-theming.

---

## 6. Effort & sequencing note

Phase 0 is the gate: without the data + auth layer, Phases 1–5 cannot be built with real,
shared, multi-user behavior — only as non-functional mockups. Recommend confirming the
Section 2 decisions (especially the backend choice) before starting Phase 0.
