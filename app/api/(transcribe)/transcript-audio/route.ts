import { client } from "@/lib/assemblyApi";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }
  const { audioUrl } = await req.json();

  try {
    await connectToDatabase();

    const userEmail = session.user.email;
    console.log("userEmail", userEmail);

    const mongoUser = await User.findOne({ email: userEmail });
    if (!mongoUser) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }
    const userId = mongoUser._id;

    const getTranscript = await client.transcripts.transcribe({
      audio: audioUrl,
      speaker_labels: true,
    });

    console.log("Transcript received:", getTranscript);

    if (getTranscript.status !== "completed") {
      return NextResponse.json(
        { error: "Transcript not completed" },
        { status: 500 }
      );
    }

    const speakersData = getTranscript.utterances?.map((utterance) => ({
      speaker: utterance.speaker,
      text: utterance.text,
      start: utterance.start,
      end: utterance.end,
    }));

    const transcribedData = await Transcript.create({
      audioUrl: audioUrl,
      transcript: getTranscript.text!,
      confidence: getTranscript.confidence!,
      speakers: speakersData,
      ownerId: userId, // ✅ linked to actual MongoDB User ID
    });

    return NextResponse.json(
      { success: true, transcriptId: transcribedData._id },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error from getting transcript");
    NextResponse.json({ error: "Failed to get the transcript" }, { status: 500 });
  }
}
