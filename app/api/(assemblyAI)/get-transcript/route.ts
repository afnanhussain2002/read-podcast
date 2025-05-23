import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { transcriptId, userId } = await req.json();

  if (!transcriptId) {
    return NextResponse.json(
      { error: "Missing required fields", success: false },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const response = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY, // Store this in .env.local
        }, 
      }
    );
    const speakersData = response.data.utterances?.map((utterance) => ({
      speaker: utterance.speaker,
      text: utterance.text,
      start: utterance.start,
      end: utterance.end,
    }));

    const transcribedData = await Transcript.create({
      audioUrl: response.data.audio_url!,
      transcript: response.data.text!,
      confidence: response.data.confidence!,
      speakers: speakersData,
      chapters: response.data.chapters,
      ownerId: userId, // ✅ linked to actual MongoDB User ID
    });

    return NextResponse.json(
      { success: true, transcriptId: transcribedData._id },
      { status: 200 }
    )
  } catch (error) {
    console.log(error, "error from saving data on database");
  }
}
