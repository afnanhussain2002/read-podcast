import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { AssemblyAI } from "assemblyai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import User from "@/models/User"; // ✅ Ensure this path is correct

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
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

    const userMinutes = mongoUser.transcriptMinutes;
    const userId = mongoUser._id;

    const { videoUrl, speakers } = await req.json();
    if (!videoUrl) {
      return NextResponse.json(
        { error: "No YouTube URL provided" },
        { status: 400 }
      );
    }

    const pythonProcess = spawn("python", [
      "./scripts/download_audio.py",
      videoUrl,
      userMinutes.toString(),
    ]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    return new Promise((resolve) => {
      pythonProcess.on("close", async (code) => {
        if (code !== 0) {
          return resolve(
            NextResponse.json(
              { error: "Failed to process video", details: error },
              { status: 500 }
            )
          );
        }

        try {
          const parsedOutput = JSON.parse(output);

          if (parsedOutput.error) {
            return resolve(
              NextResponse.json({ error: parsedOutput.error }, { status: 400 })
            );
          }

          const assemblyUrl = parsedOutput.assemblyai_url;
          const videoMinutes = parsedOutput.video_minutes;

          if (!assemblyUrl || !videoMinutes) {
            return resolve(
              NextResponse.json(
                { error: "AssemblyAI upload or video duration missing" },
                { status: 500 }
              )
            );
          }

          // Step: Send to AssemblyAI for transcription
          const transcript = await client.transcripts.transcribe({
            audio: assemblyUrl,
            speaker_labels: speakers,
            auto_chapters: true,
          });

          if (transcript.status !== "completed") {
            return resolve(
              NextResponse.json(
                { error: "Failed to transcribe audio" },
                { status: 500 }
              )
            );
          }

          const speakersData = transcript.utterances?.map((utterance) => ({
            speaker: utterance.speaker,
            text: utterance.text,
            start: utterance.start,
            end: utterance.end,
          }));

          const transcribedData = await Transcript.create({
            transcript: transcript.text!,
            confidence: transcript.confidence!,
            speakers: speakersData,
            chapters: transcript.chapters,
            ownerId: userId,
          });

          // Step: Deduct used minutes from user
          mongoUser.transcriptMinutes -= videoMinutes;
          await mongoUser.save();

          return resolve(
            NextResponse.json(
              { transcript: transcribedData._id },
              { status: 200 }
            )
          );
        } catch (err: any) {
          console.error("Error processing transcript:", err);
          return resolve(
            NextResponse.json(
              { error: "Processing error", details: err.message },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (err: any) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
