import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { AssemblyAI } from "assemblyai";
import { writeFile } from "fs/promises";
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
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    // Save the file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.name);
    await writeFile(tempFilePath, buffer);

    // Run Python script
    const pythonProcess = spawn("python", ["./scripts/download_local_audio.py", tempFilePath]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
      console.log(output, "output");
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
      console.log(error, "error from python");
    });

    /* return new Promise((resolve) => {
      pythonProcess.on("close", async (code) => {
        await unlink(tempFilePath); // clean temp file

        console.log("🐍 Python Process Exit Code:", code);
        console.log("🗂️ Python Output:", output);
        if (code !== 0 || error) {
          console.error("❌ Python Error:", error);
          return resolve(
            NextResponse.json({ error: "Failed to process video", details: error }, { status: 500 })
          );
        }

        const cloudinaryUrl = output.trim();
        if (!cloudinaryUrl.startsWith("http")) {
          return resolve(
            NextResponse.json({ error: "Invalid Cloudinary URL" }, { status: 500 })
          );
        }

        try {
          const transcript = await client.transcripts.transcribe({
            audio: cloudinaryUrl,
            speaker_labels: false,
          });

          if (transcript.status === 'completed') {
            const speakersData = transcript.utterances?.map(utterance => ({
              speaker: utterance.speaker,
              text: utterance.text,
              start: utterance.start,
              end: utterance.end
            }));

            await connectToDatabase();

            const transcribedData = await Transcript.create({
              transcript: transcript.text!,
              confidence: transcript.confidence!,
              speakers: speakersData,
              OwnerId: userId,
            });

            const createdTranscript = await Transcript.findById(transcribedData._id);

            return resolve(
              NextResponse.json({ transcript: createdTranscript._id }, { status: 200 })
            );
          } else {
            return resolve(
              NextResponse.json({ error: "Transcription not completed" }, { status: 500 })
            );
          }
        } catch (err: any) {
          console.error("❗ Error during transcription:", err);
          return resolve(
            NextResponse.json({ error: "Transcription error", details: err.message }, { status: 500 })
          );
        }
      });
    }); */
    return new Promise((resolve) => {
      pythonProcess.on("close", async (code) => {
        console.log("Python Process Exit Code:", code);
        console.log("Python Script Output:", output);

        if (code !== 0) {
          return resolve(
            NextResponse.json(
              { error: "Failed to process video", details: error },
              { status: 500 }
            )
          );
        }

        try {
          // const parsedOutput = JSON.parse(output);
          const assemblyUrl = output.trim(); // Get Cloudinary URL

          console.log(assemblyUrl, "Cloudinary URL line 132");

          if (!assemblyUrl) {
            return resolve(
              NextResponse.json(
                { error: "Cloudinary upload failed" },
                { status: 500 }
              )
            );
          }

          console.log("Uploading to AssemblyAI...");
          const transcript = await client.transcripts.transcribe({
            audio: assemblyUrl, // Use Cloudinary URL
            speaker_labels: isSpeakersEnabled,
            auto_chapters: true,
          });

          console.log("Transcript received:", transcript);

          if (transcript.status === "completed") {
            const speakersData = transcript.utterances?.map((utterance) => ({
              speaker: utterance.speaker,
              text: utterance.text,
              start: utterance.start,
              end: utterance.end,
            }));

            // save data on DB

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

            // send response
            resolve(
              NextResponse.json(
                { transcript: createdTranscript._id },
                { status: 200 }
              )
            );
          } else {
            resolve(
              NextResponse.json(
                { error: "Failed to transcribe audio" },
                { status: 500 }
              )
            );
          }
        } catch (err) {
          console.error("Error processing transcript:", err);
          resolve(
            NextResponse.json(
              { error: "Processing error", details: err.message },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (err: any) {
    console.error("🔥 Server Error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
