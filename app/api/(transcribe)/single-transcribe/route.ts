import { NextRequest, NextResponse } from "next/server";
import Transcript from "@/models/Transcript";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { transcriptId } = await req.json();

    if (!transcriptId) {
      return NextResponse.json({ error: "Transcript ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const transcript = await Transcript.findOne({ transcriptId });

    if (!transcript) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    return NextResponse.json({ transcript }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
