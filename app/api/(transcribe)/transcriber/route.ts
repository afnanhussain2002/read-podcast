/*  import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import User from "@/models/User"; // 👈 make sure this path is correct
import { client } from "@/lib/assemblyApi";
import { ErrorResponse } from "@/dataTypes/transcribeDataTypes";
import { spawn } from "child_process";



export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log("userEmail",userEmail);

    await connectToDatabase();

    const mongoUser = await User.findOne({ email: userEmail });

    if (!mongoUser) {
      return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
    }

    const userMinutes = mongoUser.transcriptMinutes;

    const userId = mongoUser._id;

    const { videoUrl, speakers } = await req.json();
    console.log("videoUrl",videoUrl);
  
     
    if (!videoUrl) {
      return NextResponse.json(
        { error: "No YouTube URL provided", success: false },
        { status: 400 }
      );
    }

    console.log("Received Video URL:", videoUrl);

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
      console.log("Error:", error);
    });

    return new Promise<Response>((resolve) => {
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
          const parsedOutput = JSON.parse(output.trim());

          if (parsedOutput.error) {
            const errorResponse: ErrorResponse = {
              error: parsedOutput.error,
              success: false,
            };
            return resolve(NextResponse.json(errorResponse, { status: 400 }));
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

          console.log("Uploading to AssemblyAI...");
          const transcript = await client.transcripts.transcribe({
            audio: assemblyUrl,
            speaker_labels: speakers,
          });

          console.log("Transcript received:", transcript);

          if (transcript.status !== "completed") {
            return resolve(
              NextResponse.json(
                { error: "Failed to transcribe audio", success: false },
                { status: 500 }
              )
            );
          }

          if (transcript.status === "completed") {
            const speakersData = transcript.utterances?.map((utterance) => ({
              speaker: utterance.speaker,
              text: utterance.text,
              start: utterance.start,
              end: utterance.end,
            }));

            const transcribedData = await Transcript.create({
              audioUrl: assemblyUrl,
              transcript: transcript.text!,
              confidence: transcript.confidence!,
              speakers: speakersData,
              ownerId: userId, // ✅ linked to actual MongoDB User ID
            });

            mongoUser.transcriptMinutes -= videoMinutes;
            await mongoUser.save();

            const createdTranscript = await Transcript.findById(
              transcribedData._id
            );

            return resolve(
              NextResponse.json(
                { transcript: createdTranscript._id, success: true },
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
        } catch (err) {
          const message =
                    err instanceof Error ? err.message : "Unknown transcription error";
                  const response: ErrorResponse = { error: message, success: false };
                  return resolve(NextResponse.json(response, { status: 500 }));
        }
      });
    });
  } catch (err) {
    const message =
    err instanceof Error ? err.message : "Unknown transcription error";
    return NextResponse.json({ error: message, success:false }, { status: 500 });
  }
}  */

  // app/api/transcriber/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import TranscriptJob from "@/models/TranscriptJob";


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
    }

    const { videoUrl, speakers } = await req.json();
    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL required", success: false }, { status: 400 });
    }

    // Create job in DB
    const newJob = await TranscriptJob.create({
      userId: user._id,
      videoUrl,
      speakers: Boolean(speakers),
      status: "pending",
    });

    return NextResponse.json({ success: true, jobId: newJob._id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
