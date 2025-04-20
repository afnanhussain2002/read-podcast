import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

   if (!session || !session.user) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
 
     const userEmail = session.user.email;
 
     await connectToDatabase();
 
     const mongoUser = await User.findOne({ email: userEmail });
 
     if (!mongoUser) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
     }
 
     const userId = mongoUser._id;

  try {

    const transcriptions = await Transcript.find({ OwnerId: userId });

    if (!transcriptions || transcriptions.length === 0) {
      return NextResponse.json({ error: "No transcriptions found" }, { status: 404 });
    }

    // Shape the response data
    const formattedTranscriptions = transcriptions.map((t) => ({
      _id: t._id.toString(),
      transcript: t.transcript.slice(0, 100),
      createdAt: t.createdAt,
      title: t.chapters?.[0]?.gist || "Untitled",
    }));

    return NextResponse.json({ transcriptions: formattedTranscriptions }, { status: 200 });

  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    return NextResponse.json({ error: "Failed to get user transcriptions" }, { status: 500 });
  }
}
