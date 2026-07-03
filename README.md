# Lexora AI — Employee Portal

Simple employee sign-in for Lexora AI LLC.

## How it works

- **Sign in** (`/`): enter full name + work email, no password. This sets up
  your account and signs you in.
- **Profile** (`/profile`): shows your name, email, and when your account was
  set up.
- **Sign out** returns you to the sign-in page.

The session is stored in a signed, HTTP-only cookie in your own browser — no
database and no setup required, so it works the moment it's deployed. Everyone
sets up their own account by signing in once.

The full design handoff (14+ screens: time tracking, leave, payroll, approvals,
CRM, etc.) lives in `design_handoff_employee_portal/` as a reference for the
larger build later.

## Tech

Next.js (App Router) · TypeScript · Tailwind CSS. Deploys on Vercel.
