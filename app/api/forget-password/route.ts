import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export default async function POST(req: NextRequest) {
    const {email} = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');




    } catch (error) {
        
    }

    
}