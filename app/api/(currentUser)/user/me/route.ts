import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
        await connectToDatabase();
      
        const user = await User.findOne({ email: session.user.email }).select("transcriptMinutes");
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ transcriptMinutes: user.transcriptMinutes, id: user._id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
  
  }