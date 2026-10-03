import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const mongooseInstance = await connectToDatabase();
    const readyState = mongooseInstance.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    return NextResponse.json({
      status: "ok",
      database: "MongoDB",
      connectionState: states[readyState] || "unknown",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        database: "MongoDB",
        message: error.message || "Failed to connect to MongoDB",
      },
      { status: 500 }
    );
  }
}
