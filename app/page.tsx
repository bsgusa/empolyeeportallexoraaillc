import { redirect } from "next/navigation";
import { getSession, createSession } from "@/lib/session";

async function signInAction(formData: FormData) {
  "use server";
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!fullName || !email || !email.includes("@")) {
    redirect("/?error=1");
  }

  await createSession({
    email,
    fullName,
    since: new Date().toISOString(),
  });
  redirect("/profile");
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/profile");

  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-[400px] p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-blue to-violet-500" />
          <h1 className="text-xl font-extrabold text-white">Lexora AI</h1>
          <p className="mt-1 text-xs text-slate">Employee Portal · Sign in</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-sm text-red">
            Please enter your full name and a valid email address.
          </div>
        )}

        <form action={signInAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Full name</label>
            <input name="fullName" required className="input" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Work email</label>
            <input
              name="email"
              type="email"
              required
              className="input"
              placeholder="jane@lexoraai.com"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-slate">
          Enter your name and work email to set up your account and see your profile.
        </p>
      </div>
    </main>
  );
}
