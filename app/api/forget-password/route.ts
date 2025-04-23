import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
    const {email} = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();
    } catch (error) {
        
    }

    
}