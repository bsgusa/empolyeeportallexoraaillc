import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

const ROLE_LABEL: Record<string, string> = {
  employee: "Employee",
  hr_admin: "HR Admin",
  super_admin: "Super Admin",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">
            Welcome, {session.fullName}
          </h1>
          <form action="/logout" method="post">
            <button type="submit" className="text-sm text-slate hover:text-red">
              Sign out
            </button>
          </form>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate">
            You&apos;re signed in as{" "}
            <span className="pill border border-blue/30 bg-blue/10 text-blue-light">
              {ROLE_LABEL[session.role] ?? session.role}
            </span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate">
            Your account is approved. The rest of the portal (time tracking, leave,
            payroll, announcements, tasks, Knowledge Book, Wellbeing Q&amp;A, and
            Growth/CRM) is being built out next.
          </p>
        </div>
      </div>
    </main>
  );
}
