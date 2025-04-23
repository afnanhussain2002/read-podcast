import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
    const {email} = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        
    } catch (error) {
        
    }

    
}