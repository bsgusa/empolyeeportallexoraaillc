export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-[420px] p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-yellow/30 bg-yellow/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#facc15"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="mb-2 text-lg font-bold text-white">Onboarding pending</h1>
        <p className="text-sm leading-relaxed text-slate">
          {name ? `Thanks, ${name}. ` : ""}
          Your account has been created and is waiting for review. Mounika Ampelli (HR
          Admin &amp; Project Supervisor) or the Super Admin will approve your onboarding
          shortly — you&apos;ll be able to sign in with your email as soon as that
          happens.
        </p>
      </div>
    </main>
  );
}
