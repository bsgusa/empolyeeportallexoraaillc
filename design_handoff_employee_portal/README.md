# Handoff: Lexora AI LLC — Employee Portal

## Overview
An internal Employee Portal for Lexora AI LLC. Employees create accounts (full name + email), HR Admin & Project Supervisor **Mounika Ampelli** approves or rejects onboarding, and everyone uses the portal for daily work: time tracking (with an open "lobby" clock), leave requests, payroll stubs, announcements, tasks, directory, documents/policies, a Knowledge Book (FAQ), an Employee Wellbeing Q&A answered by Mounika, and Growth/CRM screens (Leads, Opportunities, Marketing, Investors). The account owner is **Super Admin**.

Target codebase: `bsgusa/lexoraai-admin` (React + TypeScript + Vite + Tailwind + react-router). The repo already contains an employee portal shell (`src/components/EmployeeLayout.tsx`, `src/pages/employee/*`) — extend it rather than starting fresh. Deploys via Vercel as its own project (suggested subdomain: `portal.lexoraai.com`), separate from the marketing site.

## About the Design Files
`Lexora Employee Portal.dc.html` is a **design reference created in HTML** — a prototype showing intended look and behavior, not production code. Recreate it in the target codebase's existing React/Tailwind environment using its established patterns (Tailwind classes, lucide-react icons, existing `LexoraLogo`, `Button`, `RequirePermission` components, AuthContext).

## Fidelity
**High-fidelity.** Colors, spacing, typography and interaction states are final and match the repo's existing visual language. Recreate pixel-perfectly using the repo's Tailwind tokens.

## Roles & Permissions
- **Super Admin** (owner): everything HR can do + user removal; sees all screens.
- **HR Admin / Project Supervisor (Mounika Ampelli)**: approves/rejects onboarding, approves/denies leave, answers Wellbeing questions, posts announcements, manages CRM statuses, oversees payroll tracking.
- **Employee**: everything read/write for their own data; CRM screens read-only (status pills instead of dropdowns); no Onboarding Approvals tab.
- Signup is open (anyone can register + clock in from lobby), but accounts stay **pending** until Mounika approves. Admin can remove any account.

## Screens / Views

### 0. Auth
- **Create account** (`/signup`): centered 400px card on `#020617`; logo, "Create your account", required Full name + Email fields, primary button (gradient `#3390f0 → #1a5fa8`), footnote "Your onboarding will be reviewed by Mounika Ampelli, HR Admin & Project Supervisor."
- **Pending state**: centered card with yellow clock icon (`rgba(250,204,21,0.1)` bg, `rgba(250,204,21,0.3)` border), "Onboarding pending", copy explaining Mounika will approve. Email-based login (magic link or password per repo's existing auth).

### 1. Shell (all screens)
- **Sidebar** 256px, `#0f172a`, right border `#1e293b`. Logo block (Ascend Mark + "LEXORA AI" Sora 700 13px + tagline "RISE. WORK. BELONG." 6px letter-spaced). User block: 36px gradient avatar (`#3390f0→#7c3aed`), name, role label. Admin badge pill (blue tint) when HR/Super. Nav groups: "Workspace" (Dashboard, Onboarding Approvals [admin only], Announcements, Tasks, Directory, Leave, Time, Payroll, Wellbeing, Documents, Knowledge Book) and "Growth · CRM" (Leads, Opportunities, Marketing, Investors). Active item: `rgba(26,95,168,0.2)` bg, `#5baaf7` text, blue border, right dot. Bottom: Lexora Assistant (gold sparkle) + Sign Out (red hover).
- **Top bar** 56px, `rgba(15,23,42,0.8)` + blur, bottom border `#1e293b`: screen title left; right side has clock-in widget (live `H:MM:SS` green timer with pulsing dot when clocked in; Clock In = green gradient button, Clock Out = red tint), and user chip.
- Content bg `#020617`; cards `#0D1B2E`, border `rgba(255,255,255,0.07)`, radius 16px.

### 2. Dashboard
Greeting header ("Good morning, {name}" with blue gradient name). 4 stat cards (gradient tint backgrounds, icon, value, label, sub): My Role, Pending Leave, Hours This Week, Employment. Text values 17px, numeric 24px, weight 900. Two-column (2fr/1fr, `minmax(0,…)`): left = Latest Announcements list + Recent Leave Requests (status pills); right = This Week hours card + quick links (Directory, Request Leave, Knowledge Book).

### 3. Onboarding Approvals (admin only)
List of applicant rows: gradient avatar initials, name, email · dept · applied date; pending rows get Approve (emerald tint) / Reject (red tint) buttons; resolved rows show capitalized status pill (approved=emerald, rejected=red, pending=yellow). New signups appear here in realtime. Header notes Mounika owns approval.

### 4. Announcements
Admin sees a compose card (title input, body textarea, Publish button). Feed of cards: avatar, title, PINNED gold pill when pinned, category tag pill (Company=blue, Payroll=emerald, Product=violet, HR=gold), author · time, body. First post stays pinned.

### 5. Tasks
Header with open/done counts, inline "Add a task…" input + button (Enter submits). Card list rows: 20px rounded checkbox (emerald when done, strikethrough title), title, project · due, priority pill (HIGH=red, MED=yellow, LOW=slate).

### 6. Directory
Auto-fill grid `minmax(280px,1fr)` of people cards: 44px gradient avatar initials, name, title, dept pill (blue tint) + employment-type pill (slate), email.

### 7. Leave Requests
1fr/2fr grid. Left: New Request form (Type select pto/sick/unpaid/other, Start/End date inputs with `color-scheme:dark`, optional note, gold gradient Submit button `#facc15→#d97706` dark text). Right: requests list — employees see "My Requests" with status pills; admin sees "All Requests — team" and pending rows get Approve/Deny buttons. Statuses: pending=yellow, approved=emerald, denied=red.

### 8. Time Tracking
Header + "This week" hours card (emerald number). **Lobby time clock** banner (emerald/blue gradient tint): copy "Open entry — anyone signed in with their work email can clock in here", live timer + since-time, big Clock In/Out button. Clocking out auto-creates a time entry (rounded to 0.25h). Below, 1fr/2fr grid: Log Time form (date, hours 0–24 step .25, project, notes; emerald gradient submit) and Recent Entries list (hours in emerald, weekday date, project, notes, trash delete with red hover).

### 9. Payroll
3 stat cards: Next payday, YTD gross, YTD net (values are placeholders — wire to real payroll data). Pay Stubs table: grid `2fr 1fr 1fr 1fr auto` — period + paid date, hours, gross, net (emerald bold), PDF download button (blue tint). Payroll questions route to Wellbeing; Mounika oversees payroll tracking.

### 10. Employee Wellbeing
Ask card: textarea, "Ask anonymously" lock toggle (gold when on), "Ask Mounika" primary button. Question cards: question, from · time, status pill (Answered=emerald / Awaiting Mounika=yellow); answered ones show a reply block with gold "MA" avatar and "Mounika Ampelli · HR Admin" heading; admin sees "Post reply" button on unanswered items.

### 11. Documents & Policies
Auto-fill grid `minmax(320px,1fr)` of file rows: colored icon square (per-category tint), name, category · type · updated, download arrow, hover border-blue.

### 12. Knowledge Book (FAQ)
Accordion cards: category pill (blue tint), question 14px/600, rotating chevron; open state gets blue border and reveals answer (13px `#94a3b8`, line-height 1.7). Content is HR-editable — admin adds new FAQs daily (provide an admin "add FAQ" affordance in implementation).

### 13. Growth/CRM — Leads, Opportunities, Marketing, Investors
Shared layout: title + subtitle, status filter chips with counts (`all` + per-status; active = blue tint), 288px search input with magnifier icon, auto-fill card grid `minmax(420px,1fr)`. Cards: title (+ dimmed suffix), badge pill, optional 🔥 score (amber), date, meta rows (icon+text, blue icons), optional emerald value line, optional quoted body block (`rgba(15,23,42,0.5)` inset). Admin gets a status `<select>` styled as the pill; employees see a read-only pill.
Status sets & pill colors:
- Leads: new=blue, contacted=yellow, qualified=violet, won=emerald, lost=slate
- Opportunities: new, reviewing=yellow, pursuing=violet, won, lost=red, archived=slate
- Marketing: draft=slate, approved=yellow, scheduled=violet, published=emerald
- Investors: identified=blue, researched=cyan, contacted=yellow, responded=violet, meeting=gold, committed=emerald, passed=slate

### 14. Lexora Assistant (AI panel)
Right slide-over 380px on scrim: header with gold sparkles icon + close; chat bubbles (user = blue gradient, right-aligned, radius 14/14/4/14; assistant = `#1e293b`); "Thinking…" typing bubble; input + Send. Prototype answers canned FAQ topics (payroll, leave, clock, documents); production should call a real model and fall back to "flagged for HR → added to Knowledge Book."

## Interactions & Behavior
- Toast: bottom-center pill, `#0f172a` bg, emerald border/text, ~2.4s, for every mutation (clock in/out, submit, approve/reject, publish, etc.).
- Clock timer ticks every second; top-bar widget and Time screen share state.
- Role gating: hide Onboarding Approvals from employees; CRM selects → pills for employees.
- All buttons: hover states as specified (tint backgrounds deepen, opacity 0.9 on gradients).
- Enter key submits task input and assistant input.

## State Management
Entities: users/accounts (name, email, dept, status pending/approved/rejected, role), timeEntries (date, hours, project, notes), leaves (type, start, end, note, status, userId), announcements (title, body, tag, pinned, author, timestamp), tasks (title, project, due, priority, done), wellbeingQuestions (q, a, anonymous, from, timestamp), faqs (category, q, a), paystubs, and CRM collections (leads, opportunities, posts, investors — each with status). Repo already has Supabase/API patterns — persist there; the prototype keeps everything in component state.

## Design Tokens
- Background `#020617`; surface `#0f172a`; card `#0D1B2E`; card hover `#10233c`; borders `#1e293b` / `rgba(255,255,255,0.07)`
- Brand blues `#1a5fa8`, `#3390f0`, `#5baaf7`, `#7ac0ff`; gold `#f3c869` (star/HR accents), gold-dark `#c8921f`
- Status: emerald `#34d399`, yellow `#facc15`, red `#f87171`, violet `#a78bfa`, cyan `#22d3ee`, slate `#94a3b8`; pill pattern = color + 10% bg + 20–30% border, 999px radius
- Text: white / `#cbd5e1` / `#94a3b8` / `#64748b` / `#475569`
- Type: Inter (400–900) body; Sora 700 for the wordmark. Sizes: 24px h1 (900), 15px card headers (700), 13px body, 11–12px meta, 10px pills/eyebrows
- Radii: 16px cards, 12px avatars/inputs-large, 8px inputs/buttons, 999px pills. Padding: 32px page, 20–24px cards; gaps 16/24px
- Gradients: primary button `90deg #3390f0→#1a5fa8`; avatar `135deg #3390f0→#7c3aed`; emerald button `90deg #10b981→#0d9488`; gold button `90deg #facc15→#d97706`

## Assets
- **Lexora "Ascend Mark" logo**: already in repo at `src/components/LexoraLogo.tsx` — use it (the prototype inlines an SVG approximation: blue L-arrow + gold star).
- Icons: lucide-react (repo standard). Fonts: Inter + Sora via Google Fonts.

## Files
- `Lexora Employee Portal.dc.html` — the full interactive prototype (all 14+ screens, both roles, auth flow). Open in a browser; use the role switcher in the top bar to preview Employee / HR (Mounika) / Super Admin.

## Data Note
All names (except Mounika Ampelli), emails, dollar amounts, leads and investors in the prototype are **placeholders** — replace with real data at implementation time.
