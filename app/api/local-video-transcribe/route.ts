import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { AssemblyAI } from "assemblyai";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const speakers = formData.get("speakers") as string;
    const isSpeakersEnabled = speakers === "true";

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    // Save video file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.name);
    await writeFile(tempFilePath, buffer);

    // Spawn Python process
    const pythonProcess = spawn("python", [
      "./scripts/download_local_audio.py",
      tempFilePath,
    ]);

    let output = "";
    let error = "";

    // Timeout failsafe
    const timeout = setTimeout(() => {
      pythonProcess.kill("SIGTERM");
    }, 2 * 60 * 1000); // 2 mins max

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
      console.log("Python Output:", data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
      console.error("Python Error:", data.toString());
    });

    return new Promise((resolve) => {
      pythonProcess.on("close", async (code) => {
        clearTimeout(timeout);

        // Delete temp video file
        await unlink(tempFilePath).catch((err) => {
          console.error("🧹 Failed to delete temp file:", err);
        });

        if (code !== 0 || !output.trim()) {
          return resolve(
            NextResponse.json(
              { error: "Failed to process video", details: error },
              { status: 500 }
            )
          );
        }

        const audioUrl = output.trim(); // URL or path returned by Python
        
        console.log("Audio URL:", audioUrl);

        if (!audioUrl) {
          return resolve(
            NextResponse.json(
              { error: "AssemblyAI upload failed or no audio URL returned" },
              { status: 500 }
            )
          );
        }

        try {
          console.log("Uploading to AssemblyAI...");
          const transcript = await client.transcripts.transcribe({
            audio: audioUrl,
            speaker_labels: isSpeakersEnabled,
            auto_chapters: true,
          });

          console.log("Transcript Status:", transcript.status);

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

          await connectToDatabase();

          const transcribedData = await Transcript.create({
            transcript: transcript.text!,
            confidence: transcript.confidence!,
            speakers: speakersData,
            chapters: transcript.chapters,
            OwnerId: userId,
          });

          const createdTranscript = await Transcript.findById(
            transcribedData._id
          );

          return resolve(
            NextResponse.json(
              { transcript: createdTranscript._id },
              { status: 200 }
            )
          );
        } catch (err: any) {
          console.error("❗ Error during transcription:", err);
          return resolve(
            NextResponse.json(
              { error: "Transcription error", details: err.message },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (err: any) {
    console.error("🔥 Server Error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
