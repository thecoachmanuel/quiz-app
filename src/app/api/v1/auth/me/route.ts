import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { connectToDatabase, isConfiguredMongoUri } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (token && isConfiguredMongoUri(process.env.MONGODB_URI)) {
      try {
        await connectToDatabase();
        // Extract user id from token (e.g. jwt_token_<id>_<timestamp>)
        const tokenParts = token.split("_");
        if (tokenParts.length >= 3 && tokenParts[0] === "jwt" && tokenParts[1] === "token") {
          const userId = tokenParts[2];
          if (mongoose.Types.ObjectId.isValid(userId)) {
            const user = await User.findById(userId);
            if (user) {
              return NextResponse.json({
                status: 200,
                data: {
                  id: user._id.toString(),
                  full_name: user.name,
                  name: user.name,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  phone: user.phone || "",
                  score: user.score || 0,
                  coins: user.coins || 100,
                  balance: user.balance || 0,
                  roles: user.roles || ["user"],
                  role: user.role || "user",
                  is_kyc_verified: user.is_kyc_verified || false,
                  status: user.status || "active",
                  is_2fa_enabled: false,
                },
              });
            }
          }
        }
      } catch (err: any) {
        console.warn("[AuthMe] MongoDB user lookup error:", err?.message || err);
      }
    }

    return NextResponse.json({
      status: 200,
      data: {
        id: "1",
        full_name: "Player",
        name: "Player",
        first_name: "Player",
        last_name: "",
        email: "player@quizapp.com",
        phone: "+2348000000000",
        score: 150,
        coins: 100,
        roles: ["user"],
        role: "user",
        is_kyc_verified: false,
        status: "active",
        is_2fa_enabled: false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Failed to retrieve user" },
      { status: 500 }
    );
  }
}
