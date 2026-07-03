import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/");

  const since = new Date(session.since).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">My Profile</h1>
          <form action="/logout" method="post">
            <button type="submit" className="text-sm text-slate hover:text-red">
              Sign out
            </button>
          </form>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue to-violet-500 text-lg font-bold text-white">
              {initials(session.fullName)}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{session.fullName}</p>
              <p className="text-sm text-slate">{session.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-slate">Full name</span>
              <span className="text-white">{session.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate">Email</span>
              <span className="text-white">{session.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate">Account set up</span>
              <span className="text-white">{since}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate">
          Lexora AI LLC · Employee Portal
        </p>
      </div>
    </main>
  );
}
