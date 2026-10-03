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
        { ok: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { first_name, last_name, email, password, phone, dial_code, country_code } = body;

    if (!email || !password || !first_name) {
      return NextResponse.json(
        { ok: false, message: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const fullName = `${String(first_name).trim()} ${String(last_name || "").trim()}`.trim();
    const fullPhone = String(phone || "").trim();

    // Check / Save in MongoDB if configured
    try {
      if (process.env.MONGODB_URI) {
        await connectToDatabase();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return NextResponse.json(
            {
              status: 422,
              message: "The email has already been taken.",
              errors: { email: ["The email has already been taken."] },
            },
            { status: 422 }
          );
        }

        const newUser = await User.create({
          first_name: String(first_name).trim(),
          last_name: String(last_name || "").trim(),
          name: fullName,
          email: normalizedEmail,
          password: String(password),
          phone: fullPhone,
          coins: 100,
          balance: 0,
          score: 0,
          roles: ["user"],
          status: "active",
        });

        return NextResponse.json({
          status: 200,
          data: {
            token: `jwt_token_${newUser._id}_${Date.now()}`,
            user: {
              id: newUser._id,
              full_name: newUser.name,
              name: newUser.name,
              email: newUser.email,
              phone: newUser.phone,
              score: 0,
              coins: 100,
              is_2fa_enabled: false,
            },
          },
        });
      }
    } catch (dbErr: any) {
      console.warn("[AuthSignUp] MongoDB operation:", dbErr);
    }

    // Default registration fallback
    return NextResponse.json({
      status: 200,
      data: {
        token: `jwt_token_user_${Date.now()}`,
        user: {
          id: Date.now(),
          full_name: fullName,
          name: fullName,
          email: normalizedEmail,
          phone: fullPhone,
          score: 0,
          coins: 100,
          is_2fa_enabled: false,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Sign up failed" },
      { status: 500 }
    );
  }
}
