import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import User from "@/models/User";
import { client } from "@/lib/assemblyApi";


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
      userMinutes.toString(),
    ]);

    let output = "";
    let error = "";

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

    return new Promise<Response>((resolve) => {
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

        let audioUrl = "";
        let videoMinutes = 0;
        try {
          const parsedOutput = JSON.parse(output.trim());
          audioUrl = parsedOutput.assemblyai_url;
          videoMinutes = parsedOutput.video_minutes; // Get video minutes from the response
        } catch (err) {
          console.error("❗ Failed to parse Python output:", err, output);
          return resolve(
            NextResponse.json(
              { error: "Invalid audio URL returned by Python script" },
              { status: 500 }
            )
          );
        }

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

          // Update transcript minutes of the user
          mongoUser.transcriptMinutes -= videoMinutes;
          await mongoUser.save(); // Save the updated user document

          await connectToDatabase();

          const transcribedData = await Transcript.create({
            audioUrl,
            transcript: transcript.text!,
            confidence: transcript.confidence!,
            speakers: speakersData,
            chapters: [],
            entities: [],
            summary: "",
            ownerId: userId, // ✅ linked to actual MongoDB User ID
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
        } catch (err) {
          console.error("❗ Error during transcription:", err);
          return resolve(
            NextResponse.json(
              { error: err as string, },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    return NextResponse.json(
      { error: err as string },
      { status: 500 }
    );
  }
}
