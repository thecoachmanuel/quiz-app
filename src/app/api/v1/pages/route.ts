import { NextResponse } from "next/server";
import { DEFAULT_PAGES } from "@/constants/defaultData";

export async function GET() {
  return NextResponse.json({
    status: 200,
    data: DEFAULT_PAGES,
  });
}
