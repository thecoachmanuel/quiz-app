import { NextResponse } from "next/server";
import { DEFAULT_APP_INFO } from "@/constants/defaultData";

export async function GET() {
  return NextResponse.json({
    status: 200,
    data: DEFAULT_APP_INFO,
  });
}
