import { ISpeaker } from "@/dataTypes/transcribeDataTypes";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const duration = Number(searchParams.get("duration"));

    const body = await req.json();

    // ✅ Step 1: Ignore anything that isn't completed
    if (body.status !== "completed") {
      return NextResponse.json({ message: "Ignored non-completed transcript" }, { status: 200 });
    }

    await connectToDatabase();

    const {
      id,
      audio_url,
      text,
      confidence,
      utterances,
      chapters,
    } = body;

    // ✅ Step 2: Avoid duplicates
    const existing = await Transcript.findOne({ transcriptId: id });
    if (existing) {
      return NextResponse.json({ message: "Transcript already saved" }, { status: 200 });
    }

    // ✅ Step 3: Save transcript
    const transcriptRecord = await Transcript.create({
      transcriptId: id,
      audioUrl: audio_url,
      transcript: text,
      confidence,
      speakers: utterances?.map((u: ISpeaker) => ({
        speaker: u.speaker,
        text: u.text,
        start: u.start,
        end: u.end,
      })),
      chapters,
    });

    // ✅ Step 4: Update user & deduct minutes if query params present
    if (email && duration) {
      const user = await User.findOne({ email });
      if (user) {
        user.transcriptMinutes -= duration;
        await user.save();

        transcriptRecord.ownerId = user._id;
        await transcriptRecord.save();
      }
    }

    return NextResponse.json({ success: true, transcriptId: id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
