import { redirect } from "next/navigation";
import { listPending, listResolved } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/session";
import {
  approveAction,
  rejectAction,
  promoteAction,
  removeAction,
} from "./actions";

const STATUS_PILL: Record<string, string> = {
  approved: "border-emerald/30 bg-emerald/10 text-emerald",
  rejected: "border-red/30 bg-red/10 text-red",
  pending: "border-yellow/30 bg-yellow/10 text-yellow",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function OnboardingApprovalsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdmin(session.role)) redirect("/dashboard");

  const [pending, resolved] = await Promise.all([listPending(), listResolved()]);
  const isSuperAdmin = session.role === "super_admin";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Onboarding Approvals</h1>
            <p className="mt-1 text-xs text-slate">
              Reviewed by Mounika Ampelli (HR Admin &amp; Project Supervisor) and the
              Super Admin.
            </p>
          </div>
          <form action="/logout" method="post">
            <button type="submit" className="text-sm text-slate hover:text-red">
              Sign out
            </button>
          </form>
        </div>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-white">
            Pending ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <p className="card p-6 text-sm text-slate">No pending applicants.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((p) => (
                <div
                  key={p.id}
                  className="card flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue to-violet-500 text-xs font-bold text-white">
                      {initials(p.full_name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {p.full_name}
                      </p>
                      <p className="text-xs text-slate">
                        {p.email} · applied{" "}
                        {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald hover:bg-emerald/20"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red/30 bg-red/10 px-3 py-1.5 text-xs font-semibold text-red hover:bg-red/20"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold text-white">
            Resolved ({resolved.length})
          </h2>
          {resolved.length === 0 ? (
            <p className="card p-6 text-sm text-slate">No resolved accounts yet.</p>
          ) : (
            <div className="space-y-2">
              {resolved.map((p) => (
                <div
                  key={p.id}
                  className="card flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue to-violet-500 text-xs font-bold text-white">
                      {initials(p.full_name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {p.full_name}{" "}
                        {p.role !== "employee" && (
                          <span className="pill ml-1 border border-blue/30 bg-blue/10 text-blue-light">
                            {p.role === "super_admin" ? "Super Admin" : "HR Admin"}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate">{p.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`pill border ${STATUS_PILL[p.status]}`}>
                      {p.status}
                    </span>
                    {isSuperAdmin && p.role === "employee" && (
                      <form action={promoteAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20"
                        >
                          Make HR Admin
                        </button>
                      </form>
                    )}
                    {isSuperAdmin && p.role !== "super_admin" && (
                      <form action={removeAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red/30 bg-red/10 px-3 py-1.5 text-xs font-semibold text-red hover:bg-red/20"
                        >
                          Remove
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
