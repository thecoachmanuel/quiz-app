import { DEFAULT_CACHE_KEY, SERVER_SIDE_API_URLS } from "@/configs";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000;
const ipStore = new Map<string, { count: number; time: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record) {
    ipStore.set(ip, { count: 1, time: now });
    return false;
  }

  if (now - record.time > WINDOW_MS) {
    ipStore.set(ip, { count: 1, time: now });
    return false;
  }

  record.count++;

  return record.count > RATE_LIMIT;
}
export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests" },
      { status: 429 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(SERVER_SIDE_API_URLS).forEach(([key, value]) => {
    revalidateTag(value.cacheKey, "max");
  });

  revalidateTag(DEFAULT_CACHE_KEY, "max");

  revalidatePath("/", "layout");

  return NextResponse.json({
    success: true,
    message: "Cache invalidated successfully",
  });
}
