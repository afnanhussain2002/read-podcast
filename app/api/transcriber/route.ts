import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { AssemblyAI } from "assemblyai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";

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

    const { videoUrl, speakers } = await req.json();
    if (!videoUrl) {
      return NextResponse.json(
        { error: "No YouTube URL provided" },
        { status: 400 }
      );
    }

    console.log("Received Video URL:", videoUrl);

    // Run Python script to download audio and upload to AssemblyAI
    const pythonProcess = spawn("python", [
      "./scripts/download_audio.py",
      videoUrl,
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
          const parsedOutput = JSON.parse(output);
          const assemblyUrl = parsedOutput.assemblyai_url;

          if (!assemblyUrl) {
            return resolve(
              NextResponse.json(
                { error: "AssemblyAI upload failed" },
                { status: 500 }
              )
            );
          }

          console.log("Uploading to AssemblyAI...");
          const transcript = await client.transcripts.transcribe({
            audio: assemblyUrl,
            speaker_labels: speakers,
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
                {
                  transcript: transcript.text,
                  confidence: transcript.confidence!,
                  speakers: speakersData,
                  chapters: transcript.chapters,
                  transcriptId: createdTranscript?._id,
                },
                { status: 200 }
              )
            );
          } else {
            return resolve(
              NextResponse.json(
                { error: "Failed to transcribe audio" },
                { status: 500 }
              )
            );
          }
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
