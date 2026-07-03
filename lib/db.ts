import { neon } from "@neondatabase/serverless";

export type Role = "employee" | "hr_admin" | "super_admin";
export type Status = "pending" | "approved" | "rejected";

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  status: Status;
  created_at: string;
  decided_at: string | null;
  decided_by: string | null;
}

function getConnectionString(): string {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "No database connection string found. Set DATABASE_URL (or POSTGRES_URL) in the Vercel project's environment variables."
    );
  }
  return url;
}

let sqlClient: ReturnType<typeof neon> | null = null;

function sql() {
  if (!sqlClient) sqlClient = neon(getConnectionString());
  return sqlClient;
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = sql()`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'employee',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        decided_at TIMESTAMPTZ,
        decided_by TEXT
      )
    `.then(() => undefined);
  }
  return schemaReady;
}

export async function findEmployeeByEmail(email: string): Promise<Employee | null> {
  await ensureSchema();
  const rows = (await sql()`
    SELECT * FROM employees WHERE email = ${email.toLowerCase().trim()} LIMIT 1
  `) as Employee[];
  return rows[0] ?? null;
}

export async function countEmployees(): Promise<number> {
  await ensureSchema();
  const rows = (await sql()`SELECT count(*)::text AS count FROM employees`) as {
    count: string;
  }[];
  return Number(rows[0]?.count ?? 0);
}

export async function createSignup(fullName: string, email: string): Promise<Employee> {
  await ensureSchema();
  const normalizedEmail = email.toLowerCase().trim();
  const isFirstAccount = (await countEmployees()) === 0;
  const role: Role = isFirstAccount ? "super_admin" : "employee";
  const status: Status = isFirstAccount ? "approved" : "pending";

  const rows = (await sql()`
    INSERT INTO employees (full_name, email, role, status, decided_at, decided_by)
    VALUES (
      ${fullName.trim()},
      ${normalizedEmail},
      ${role},
      ${status},
      ${isFirstAccount ? new Date().toISOString() : null},
      ${isFirstAccount ? "system (first account)" : null}
    )
    RETURNING *
  `) as Employee[];
  return rows[0];
}

export async function listPending(): Promise<Employee[]> {
  await ensureSchema();
  return (await sql()`
    SELECT * FROM employees WHERE status = 'pending' ORDER BY created_at ASC
  `) as Employee[];
}

export async function listResolved(): Promise<Employee[]> {
  await ensureSchema();
  return (await sql()`
    SELECT * FROM employees WHERE status != 'pending' ORDER BY decided_at DESC NULLS LAST, created_at DESC
  `) as Employee[];
}

export async function decideEmployee(
  id: number,
  status: "approved" | "rejected",
  decidedBy: string
): Promise<void> {
  await ensureSchema();
  await sql()`
    UPDATE employees
    SET status = ${status}, decided_at = now(), decided_by = ${decidedBy}
    WHERE id = ${id}
  `;
}

export async function setRole(id: number, role: Role): Promise<void> {
  await ensureSchema();
  await sql()`UPDATE employees SET role = ${role} WHERE id = ${id}`;
}

export async function removeEmployee(id: number): Promise<void> {
  await ensureSchema();
  await sql()`DELETE FROM employees WHERE id = ${id}`;
}
