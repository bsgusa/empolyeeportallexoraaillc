"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decideEmployee, removeEmployee, setRole } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdmin(session.role)) redirect("/dashboard");
  return session;
}

export async function approveAction(formData: FormData) {
  const session = await requireAdmin();
  const id = Number(formData.get("id"));
  await decideEmployee(id, "approved", session.email);
  revalidatePath("/admin/onboarding");
}

export async function rejectAction(formData: FormData) {
  const session = await requireAdmin();
  const id = Number(formData.get("id"));
  await decideEmployee(id, "rejected", session.email);
  revalidatePath("/admin/onboarding");
}

export async function promoteAction(formData: FormData) {
  const session = await requireAdmin();
  if (session.role !== "super_admin") redirect("/admin/onboarding");
  const id = Number(formData.get("id"));
  await setRole(id, "hr_admin");
  revalidatePath("/admin/onboarding");
}

export async function removeAction(formData: FormData) {
  const session = await requireAdmin();
  if (session.role !== "super_admin") redirect("/admin/onboarding");
  const id = Number(formData.get("id"));
  await removeEmployee(id);
  revalidatePath("/admin/onboarding");
}
