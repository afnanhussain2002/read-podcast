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
 const { duration, audioUrl, speakers } = await req.json();

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

    if (mongoUser.transcriptMinutes < duration!) {
      return NextResponse.json(
        { error: "Not enough minutes", success: false },
        { status: 400 }
      );
    }

    const getTranscript = await client.transcripts.transcribe({
      audio: audioUrl,
      speaker_labels: speakers,
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
      audioUrl: getTranscript.audio_url!,
      transcript: getTranscript.text!,
      confidence: getTranscript.confidence!,
      speakers: speakersData,
      ownerId: userId, // ✅ linked to actual MongoDB User ID
    });

    mongoUser.transcriptMinutes -= Number(duration!);
    await mongoUser.save();

    return NextResponse.json(
      { success: true, transcriptId: transcribedData._id },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong while getting transcript";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* export async function POST(req: NextRequest) {

  const formData = await req.formData();
  const audioFile = formData.get("file") as File | null;

  console.log("audioFile", audioFile);

  if (!audioFile) {
    return NextResponse.json(
      { error: "Audio file is required" },
      { status: 400 }
    );
  }

  try {

    const uploadAssembly = await client.transcripts.transcribe({
      audio: audioFile,
    });

    console.log("uploadAssembly", uploadAssembly);

    return NextResponse.json({ uploadAssembly }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: error as string }, { status: 500 });
  }



} */
