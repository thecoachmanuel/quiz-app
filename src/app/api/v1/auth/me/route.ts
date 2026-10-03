import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: 200,
    data: {
      id: 1,
      full_name: "Player",
      name: "Player",
      email: "player@quizapp.com",
      score: 150,
      coins: 100,
      is_2fa_enabled: false,
    },
  });
}
