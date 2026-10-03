import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "Username/Email and password are required" },
        { status: 400 }
      );
    }

    const loginId = String(username).trim().toLowerCase();

    // Check MongoDB if configured
    try {
      if (process.env.MONGODB_URI) {
        await connectToDatabase();
        const user = await UserModel.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (user && user.password === String(password)) {
          return NextResponse.json({
            status: 200,
            data: {
              token: `jwt_token_${user._id}_${Date.now()}`,
              user: {
                id: user._id,
                full_name: user.name,
                name: user.name,
                email: user.email,
                score: user.score || 0,
                coins: user.coins || 100,
                is_2fa_enabled: false,
              },
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("[AuthSignIn] MongoDB check skipped:", dbErr);
    }

    // Default demo user fallback
    const displayName = loginId.includes("@") ? loginId.split("@")[0] : loginId;
    return NextResponse.json({
      status: 200,
      data: {
        token: `jwt_token_demo_${Date.now()}`,
        user: {
          id: 1,
          full_name: displayName,
          name: displayName,
          email: loginId.includes("@") ? loginId : `${loginId}@quizapp.com`,
          score: 150,
          coins: 100,
          is_2fa_enabled: false,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Sign in failed" },
      { status: 500 }
    );
  }
}
