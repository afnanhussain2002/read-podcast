import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { password, email } = await req.json();

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

    } catch (error) {
        
    }

    

  
}