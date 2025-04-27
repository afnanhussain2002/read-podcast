import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextRequest, NextResponse } from "next/server";

// Define the params interface explicitly
interface RouteContext {
  params: {
    id: string;
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const id = context.params.id;

  try {
    await connectToDatabase();

    const transcript = await Transcript.findById(id);

    if (!transcript) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    // Make sure the response structure matches what your frontend expects
    return NextResponse.json({ 
      _id: transcript._id,
      audioUrl: transcript.audioUrl,
      transcript: transcript.transcript,
      confidence: transcript.confidence,
      createdAt: transcript.createdAt,
      chapters: transcript.chapters || [],
      entities: transcript.entities || [],
      summary: transcript.summary || null,
      speakers: transcript.speakers || [],
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 });
  }
}