import Link from "next/link";
import { signupAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please enter your full name and a valid email address.",
  exists: "An account with that email already exists. Try signing in instead.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-[400px] p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-blue to-violet-500" />
          <h1 className="text-xl font-extrabold text-white">Create your account</h1>
        </div>

        {error && ERROR_MESSAGES[error] && (
          <div className="mb-4 rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-sm text-red">
            {ERROR_MESSAGES[error]}
          </div>
        )}

        <form action={signupAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Full name</label>
            <input name="fullName" required className="input" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Email</label>
            <input
              name="email"
              type="email"
              required
              className="input"
              placeholder="jane@lexoraai.com"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-slate">
          Your onboarding will be reviewed by Mounika Ampelli, HR Admin &amp; Project
          Supervisor.
        </p>

        <p className="mt-4 text-center text-xs text-slate">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-light hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
