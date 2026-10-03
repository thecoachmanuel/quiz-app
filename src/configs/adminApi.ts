/** @format */

import { SERVER_URL } from "@/configs";

export const ADMIN_TOKEN_NAME =
  process.env.NEXT_PUBLIC_ADMIN_TOKEN_NAME || "quiz_admin_token";

export const ADMIN_API_BASE = SERVER_URL + "/api/v1/admin";

/** Helper to get admin token from localStorage (client-side only) */
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_NAME);
}

/** Helper to set admin token */
export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_NAME, token);
}

/** Helper to remove admin token */
export function removeAdminToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_NAME);
}

/** Base fetch helper for admin API calls */
export async function adminFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; status: number; ok: boolean }> {
  const token = getAdminToken();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${ADMIN_API_BASE}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, { ...options, headers });
  let data: T;

  try {
    data = await response.json();
  } catch {
    data = {} as T;
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
}
