import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { videoUrl, speakers } = await req.json();
        if (!videoUrl) {
            return NextResponse.json({ error: "No YouTube URL provided" }, { status: 400 });
        }

        console.log("Received Video URL:", videoUrl);

        // Run Python script to download audio and upload to Cloudinary
        const pythonProcess = spawn("python", ["./scripts/download_audio.py", videoUrl]);

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
                    return resolve(NextResponse.json({ error: "Failed to process video", details: error }, { status: 500 }));
                }

                try {
                    const parsedOutput = JSON.parse(output);
                    const cloudinaryUrl = parsedOutput.cloudinary_url; // Get Cloudinary URL

                    if (!cloudinaryUrl) {
                        return resolve(NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 }));
                    }

                    console.log("Uploading to AssemblyAI...");
                    const transcript = await client.transcripts.transcribe({
                        audio: cloudinaryUrl, // Use Cloudinary URL
                        speaker_labels: speakers,
                    });

                    console.log("Transcript received:", transcript);

                    if (transcript.status === 'completed') {
                        resolve(NextResponse.json({ transcript: transcript.text, speakers: transcript.utterances, confidence: transcript.confidence }));
                    } else {
                        resolve(NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 }));
                    }
                } catch (err) {
                    console.error("Error processing transcript:", err);
                    resolve(NextResponse.json({ error: "Processing error", details: err.message }, { status: 500 }));
                }
            });
        });
    } catch (err) {
        console.error("Server Error:", err);
        return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
    }
}
