import { NextResponse } from "next/server";

export async function GET() {
  const adminEmail = (
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    "admin@quizapp.com"
  )
    .trim()
    .toLowerCase();

  return NextResponse.json({
    ok: true,
    data: {
      id: 1,
      full_name: "Master Administrator",
      name: "Master Administrator",
      email: adminEmail,
      role: "Super Admin",
      roles: ["Super Admin"],
    },
  });
}
