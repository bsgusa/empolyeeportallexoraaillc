"use server";

import { redirect } from "next/navigation";
import { findEmployeeByEmail } from "@/lib/db";
import { createSession, isAdmin } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) redirect("/login?error=invalid");

  const employee = await findEmployeeByEmail(email);
  if (!employee) redirect("/login?error=notfound");
  if (employee.status === "rejected") redirect("/login?error=rejected");
  if (employee.status === "pending") {
    redirect(`/pending?name=${encodeURIComponent(employee.full_name)}`);
  }

  await createSession({
    email: employee.email,
    fullName: employee.full_name,
    role: employee.role,
  });

  redirect(isAdmin(employee.role) ? "/admin/onboarding" : "/dashboard");
}
