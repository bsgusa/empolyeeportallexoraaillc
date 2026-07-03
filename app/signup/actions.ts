"use server";

import { redirect } from "next/navigation";
import { createSignup, findEmployeeByEmail } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function signupAction(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!fullName || !email || !email.includes("@")) {
    redirect("/signup?error=invalid");
  }

  const existing = await findEmployeeByEmail(email);
  if (existing) {
    redirect("/signup?error=exists");
  }

  const employee = await createSignup(fullName, email);

  if (employee.status === "approved") {
    await createSession({
      email: employee.email,
      fullName: employee.full_name,
      role: employee.role,
    });
    redirect("/admin/onboarding");
  }

  redirect(`/pending?name=${encodeURIComponent(fullName)}`);
}
