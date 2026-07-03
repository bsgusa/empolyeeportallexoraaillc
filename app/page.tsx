import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (isAdmin(session.role)) redirect("/admin/onboarding");
  redirect("/dashboard");
}
