import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase, isConfiguredMongoUri } from "@/lib/mongodb";
import { User } from "@/models/User";

function verifyPassword(plain: string, stored?: string): boolean {
  if (!stored) return false;
  if (plain === stored) return true;
  const hash = crypto.createHash("sha256").update(plain).digest("hex");
  return hash === stored;
}

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
        {
          status: 422,
          message: "Email/Username and password are required",
          errors: {
            username: !username ? ["Email or username is required"] : [],
            password: !password ? ["Password is required"] : [],
          },
        },
        { status: 422 }
      );
    }

    const loginId = String(username).trim().toLowerCase();
    const inputPassword = String(password);

    // 1. Check MongoDB if configured
    if (isConfiguredMongoUri(process.env.MONGODB_URI)) {
      try {
        await connectToDatabase();
        const user = await User.findOne({
          $or: [
            { email: loginId },
            { name: { $regex: new RegExp(`^${loginId.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`, "i") } },
          ],
        });

        if (user) {
          if (verifyPassword(inputPassword, user.password)) {
            return NextResponse.json({
              status: 200,
              data: {
                token: `jwt_token_${user._id}_${Date.now()}`,
                user: {
                  id: user._id.toString(),
                  full_name: user.name,
                  name: user.name,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  phone: user.phone || "",
                  score: user.score || 0,
                  coins: user.coins || 100,
                  roles: user.roles || ["user"],
                  is_2fa_enabled: false,
                },
              },
            });
          } else {
            return NextResponse.json(
              {
                status: 422,
                message: "Invalid email or password.",
                errors: {
                  password: ["The password does not match our records."],
                },
              },
              { status: 422 }
            );
          }
        } else {
          // If user not found in DB and this is not a known demo account:
          const isDemoAccount =
            loginId === "demo@quizapp.com" ||
            loginId === "player@quizapp.com" ||
            loginId === "admin@quizapp.com" ||
            loginId === "demo";

          if (!isDemoAccount) {
            return NextResponse.json(
              {
                status: 422,
                message: "No account found with this email or username. Please check your credentials or sign up.",
                errors: {
                  username: ["No account found with this email/username."],
                },
              },
              { status: 422 }
            );
          }
        }
      } catch (dbErr: any) {
        console.warn("[AuthSignIn] MongoDB check error:", dbErr?.message || dbErr);
      }
    }

    // 2. Demo / Standalone fallback user
    const displayName = loginId.includes("@") ? loginId.split("@")[0] : loginId;
    return NextResponse.json({
      status: 200,
      data: {
        token: `jwt_token_demo_${Date.now()}`,
        user: {
          id: "1",
          full_name: displayName,
          name: displayName,
          first_name: displayName,
          last_name: "",
          email: loginId.includes("@") ? loginId : `${loginId}@quizapp.com`,
          phone: "+2348000000000",
          score: 150,
          coins: 100,
          roles: ["user"],
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
