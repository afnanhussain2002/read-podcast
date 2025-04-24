import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const { password, email } = await req.json();

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        existingUser.password = hashedPassword;
        existingUser.resetToken = undefined;
        existingUser.resetTokenExpiry = undefined;

        await existingUser.save();

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });




    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }

    

  
}