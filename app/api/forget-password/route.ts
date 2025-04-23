import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendForgetPassword } from "@/helper/sendForgetPassword";

export default async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetTokenExpiry;

    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password/${resetToken}`;

    const emailResponse = await sendForgetPassword(email, resetUrl);

    if (!emailResponse.success) {
      existingUser.resetToken = undefined;
      existingUser.resetTokenExpiry = undefined;
      await existingUser.save();
      return NextResponse.json(
        "Failed to send password reset email",
        { status: 500 }
      )
    }

    await existingUser.save();

    return NextResponse.json(
      {
        success: true,
        message: emailResponse.message,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error as string }, { status: 500 });
  }
}
