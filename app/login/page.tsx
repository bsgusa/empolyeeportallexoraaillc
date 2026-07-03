import Link from "next/link";
import { loginAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please enter your email address.",
  notfound: "No account found for that email. Create one below.",
  rejected: "This account was not approved. Contact Mounika Ampelli (HR Admin) for help.",
};

export default async function LoginPage({
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
          <h1 className="text-xl font-extrabold text-white">Sign in</h1>
          <p className="mt-1 text-xs text-slate">Lexora AI Employee Portal</p>
        </div>

        {error && ERROR_MESSAGES[error] && (
          <div className="mb-4 rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-sm text-red">
            {ERROR_MESSAGES[error]}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
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
            Continue
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate">
          No account yet?{" "}
          <Link href="/signup" className="text-blue-light hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
