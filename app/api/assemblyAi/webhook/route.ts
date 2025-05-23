/* import { ISpeaker } from "@/dataTypes/transcribeDataTypes";
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
 */

/* import { connectToDatabase } from "@/lib/db";
import { transcriptionQueue } from "@/lib/queue";
import Transcript from "@/models/Transcript";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Webhook triggered");
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const duration = Number(searchParams.get("duration"));
    const body = await req.json();

    if (body.status !== "completed") {
      return NextResponse.json({ message: "Ignored non-completed transcript" }, { status: 200 });
    }

    await connectToDatabase();

    // Avoid duplicates
    const existing = await Transcript.findOne({ transcriptId: body.id });
    if (existing) {
      return NextResponse.json({ message: "Transcript already saved" }, { status: 200 });
    }

    // Push to Redis Queue instead of processing immediately
    await transcriptionQueue.add("process-transcription", {
      transcriptId: body.id,
      email,
      duration,
      body,
    });

    return NextResponse.json({ success: true, message: "Queued for processing" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} */

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import User from "@/models/User";
import { ISpeaker } from "@/dataTypes/transcribeDataTypes";
import axios from "axios";

export async function POST(req: Request) {
  console.log("Webhook triggered");
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const duration = Number(searchParams.get("duration"));

    const body = await req.json();
    const transcriptId = body.transcript_id;
    const status = body.status;

    console.log("👀 Webhook hit with body:", body);

    if (status !== "completed" || !transcriptId) {
      return NextResponse.json({ message: "Ignored non-completed webhook" }, { status: 200 });
    }

    // Connect to DB early
    await connectToDatabase();

    // Check for existing transcript
    const existing = await Transcript.findOne({ transcriptId });
    if (existing) {
      return NextResponse.json({ message: "Transcript already saved" }, { status: 200 });
    }

    // Fetch full transcript from AssemblyAI
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    const { data } = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    console.log("✅ AssemblyAI response:", data);

    const {
      id,
      audio_url,
      text,
      confidence,
      utterances,
      chapters,
    } = data;

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

    // Update user minutes & ownership
    if (email && duration) {
      const user = await User.findOne({ email });
      if (user) {
        user.transcriptMinutes -= duration;
        await user.save();

        transcriptRecord.ownerId = user._id;
        await transcriptRecord.save();
      }
    }

    console.log("✅ Transcript saved:", transcriptRecord);

    return NextResponse.json({ success: true, transcriptId: id });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    console.error("❌ Webhook error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


