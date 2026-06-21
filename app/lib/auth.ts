import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "portfolio_admin_session";

function getExpectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET ?? "portfolio-admin-secret";

  if (!password) {
    return null;
  }

  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export function isAdminPasswordValid(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }

  const a = Buffer.from(password);
  const b = Buffer.from(expected);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export function createAdminSessionToken(): string | null {
  return getExpectedToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = getExpectedToken();
  if (!expected) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return false;
  }

  const a = Buffer.from(token);
  const b = Buffer.from(expected);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
