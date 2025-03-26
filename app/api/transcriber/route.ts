import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { videoUrl } = await req.json();
        if (!videoUrl) {
            return NextResponse.json({ error: "No YouTube URL provided" }, { status: 400 });
        }

        console.log("Received Video URL:", videoUrl);

        // Run Python script to download and convert YouTube video
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
                    const filePath = path.join(process.cwd(), "public", "audio.mp3");

                    if (!fs.existsSync(filePath)) {
                        return resolve(NextResponse.json({ error: "Audio file not found" }, { status: 500 }));
                    }

                    console.log("Uploading to AssemblyAI...");
                    const transcript = await client.transcripts.transcribe({
                        audio: `file://${filePath}`, // Uploading local file
                    });

                    console.log("Transcript received:", transcript);

                    // Delete the file after transcription
                    fs.unlinkSync(filePath);
                    console.log("Deleted local file:", filePath);

                    resolve(NextResponse.json({ transcript }));
                } catch (err) {
                    resolve(NextResponse.json({ error: "Processing error", details: err }, { status: 500 }));
                }
            });
        });
    } catch (err) {
        return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
    }
}
