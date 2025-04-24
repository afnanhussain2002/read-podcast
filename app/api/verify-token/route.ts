import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  await connectToDatabase();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }  
  
  return NextResponse.json({ user }, { status: 200 });
}
