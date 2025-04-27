import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    await connectToDatabase();

    const transcript = await Transcript.findById(id);

    if (!transcript) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    return NextResponse.json(transcript, { status: 200 });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json({ error: "Failed to get the transcript" }, { status: 500 });
  }
}
