import { NextResponse } from "next/server";
import { DEFAULT_MENUS } from "@/constants/defaultData";

export async function GET() {
  return NextResponse.json({
    status: 200,
    data: DEFAULT_MENUS,
  });
}
