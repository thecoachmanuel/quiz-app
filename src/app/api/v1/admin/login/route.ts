import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User, UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const inputEmail = String(email).trim().toLowerCase();
    const inputPassword = String(password);

    // Read admin credentials from environment variables
    const adminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      "admin@quizapp.com"
    )
      .trim()
      .toLowerCase();

    const adminPassword = String(
      process.env.ADMIN_PASSWORD ||
        process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
        "admin123456"
    );

    // 1. Verify against Environment Variables
    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      return NextResponse.json({
        ok: true,
        token: `admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        data: {
          id: 1,
          full_name: "Master Administrator",
          name: "Master Administrator",
          email: adminEmail,
          role: "Super Admin",
          roles: ["Super Admin"],
        },
        message: "Login successful",
      });
    }

    // 2. Fallback to MongoDB if configured
    try {
      if (process.env.MONGODB_URI) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: inputEmail });
        const hasAdminRole =
          dbUser &&
          (dbUser.roles?.includes("admin") ||
            dbUser.roles?.includes("Super Admin") ||
            (dbUser as any).role === "admin");

        if (dbUser && hasAdminRole && dbUser.password === inputPassword) {
          return NextResponse.json({
            ok: true,
            token: `admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            data: {
              id: dbUser._id,
              full_name: dbUser.name,
              name: dbUser.name,
              email: dbUser.email,
              role: "Super Admin",
              roles: ["Super Admin"],
            },
            message: "Login successful",
          });
        }
      }
    } catch (dbErr) {
      console.warn("[AdminLogin] MongoDB lookup skipped:", dbErr);
    }

    return NextResponse.json(
      {
        ok: false,
        message:
          "Invalid email or password. You can configure your admin credentials via ADMIN_EMAIL and ADMIN_PASSWORD in .env.local or your Vercel project settings.",
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
