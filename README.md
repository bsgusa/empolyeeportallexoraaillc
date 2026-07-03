# Lexora AI — Employee Portal

Internal employee portal for Lexora AI LLC: onboarding approvals, time tracking,
leave requests, payroll stubs, announcements, tasks, directory, documents,
a Knowledge Book (FAQ), Employee Wellbeing Q&A, and Growth/CRM (Leads,
Opportunities, Marketing, Investors).

## Current status

This repo currently holds the **design handoff** for the portal — a
high-fidelity static HTML prototype (`index.html`, also mirrored in
`design_handoff_employee_portal/`) plus the full implementation spec in
[`design_handoff_employee_portal/README.md`](design_handoff_employee_portal/README.md).

`index.html` is deployed as-is so it can be reviewed live, but it is a
**prototype only** — role switching, login, and data are all simulated in
browser memory and reset on refresh. There is no real backend, auth, or
persistence yet.

## Auth requirements for the real build

Per product decision: signup/login is **name + email only, no password**.
Employees create an account with full name + email; HR Admin & Project
Supervisor Mounika Ampelli approves or rejects onboarding before the account
is active. Once approved, employees can ask Mounika questions (Employee
Wellbeing Q&A) and submit help/work requests (Tasks).

## Next step

Build the real app (React/TypeScript/Vite/Tailwind, per the spec) with actual
auth, roles, and persistence, replacing this static prototype.
