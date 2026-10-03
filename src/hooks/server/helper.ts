"use server";

import { LOCALE_KEY } from "@/configs";
import { cookies } from "next/headers";

export const setLocaleCookies = async (local: string) => {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_KEY, local);
};

export const removeLocaleCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(LOCALE_KEY);
};

export const getLocaleCookies = async (defaultLocale?: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(LOCALE_KEY)?.value || defaultLocale || "en";
};
