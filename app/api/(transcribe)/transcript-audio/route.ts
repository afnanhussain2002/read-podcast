import { client, s3 } from "@/lib/assemblyApi";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import User from "@/models/User";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
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
      auto_chapters: true,
    });

    console.log("Transcript received:", getTranscript);

    if (getTranscript.status !== "completed") {
      return NextResponse.json(
        { error: "Transcript not completed" },
        { status: 500 }
      );
    }

    const url = new URL(audioUrl);
    const key = url.pathname.slice(1);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    const response = await s3.send(deleteCommand);

    if (response.$metadata.httpStatusCode === 204) {
      console.log("✅ File successfully deleted.");
    } else {
      console.warn(
        "⚠️ Delete command responded with status:",
        response.$metadata.httpStatusCode
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
      chapters: getTranscript.chapters,
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
      error instanceof Error
        ? error.message
        : "Something went wrong while getting transcript";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}




/* import { client, s3 } from "@/lib/assemblyApi";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
  }

  const { duration, audioUrl, speakers } = await req.json();

  try {
    await connectToDatabase();

    const mongoUser = await User.findOne({ email: session.user.email });
    if (!mongoUser) {
      return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
    }

    if (mongoUser.transcriptMinutes < duration) {
      return NextResponse.json({ error: "Not enough minutes", success: false }, { status: 400 });
    }

  const encodedEmail = encodeURIComponent(session.user.email!);
const webhookUrl = `${process.env.NEXT_PUBLIC_URL}/api/assemblyAi/webhook?email=${encodedEmail}&duration=${duration}`;

const assemblyResponse = await client.transcripts.submit({
  audio: audioUrl,
  speaker_labels: speakers,
  auto_chapters: true,
  webhook_url: webhookUrl,
});


    // ✅ We don't expect 'completed' here — it's async.
    console.log("Transcript submitted:", assemblyResponse);

    // ✅ Optionally delete audio file now
    const url = new URL(audioUrl);
    const key = url.pathname.slice(1);
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    await s3.send(deleteCommand);

    return NextResponse.json({
      success: true,
      transcriptId: assemblyResponse.id,
      status: assemblyResponse.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong while getting transcript";

    return NextResponse.json({ error: message }, { status: 500 });
  }
} */
