import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import cloudinaryUpload from "@/lib/cloudinaryUpload";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();
    console.log("Received Video URL:", videoUrl);

    if (!videoUrl) {
      return NextResponse.json({ error: "No YouTube URL provided" }, { status: 400 });
    }

    const pythonProcess = spawn("python", ["./scripts/download_audio.py", videoUrl]);

    let output = "";
    let error = "";

    return new Promise((resolve) => {
      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        console.log("Python Process Exit Code:", code);

        if (code !== 0) {
          console.error("Python Script Error:", error);
          return resolve(
            NextResponse.json({ error: "Failed to process video", details: error }, { status: 500 })
          );
        }

        try {
          // Trim extra spaces and ensure JSON parsing
          const trimmedOutput = output.trim();
          console.log("Python Script Clean Output:", trimmedOutput);

          const parsedOutput = JSON.parse(trimmedOutput);
          const filePath = parsedOutput?.file_path;

          if (!filePath) {
            console.error("File path missing in Python output");
            return resolve(
              NextResponse.json({ error: "Audio file not found" }, { status: 500 })
            );
          }

          const fullFilePath = path.join(process.cwd(), "public", filePath);
          console.log("Full Audio File Path:", fullFilePath);

          if (!fs.existsSync(fullFilePath)) {
            console.error("File does not exist:", fullFilePath);
            return resolve(
              NextResponse.json({ error: "Downloaded audio file not found" }, { status: 500 })
            );
          }

          console.log("Uploading to Cloudinary...");
          const cloudinaryUrl = await cloudinaryUpload(fullFilePath);

          if (!cloudinaryUrl) {
            console.error("Cloudinary upload failed");
            return resolve(
              NextResponse.json({ error: "Failed to upload audio to Cloudinary" }, { status: 500 })
            );
          }

          console.log("Sending to AssemblyAI for transcription...");
          const transcript = await client.transcripts.transcribe({ audio_url: cloudinaryUrl });

          console.log("AssemblyAI Transcription Successful:", transcript);

          try {
            fs.unlinkSync(fullFilePath);
            console.log(`Deleted file: ${fullFilePath}`);
          } catch (unlinkError) {
            console.error("Error deleting file:", unlinkError);
          }

          return resolve(
            NextResponse.json({ transcript, cloudinaryUrl }, { status: 200 })
          );
        } catch (err) {
          console.error("Processing Error:", err);
          return resolve(
            NextResponse.json({ error: "Processing error", details: err }, { status: 500 })
          );
        }
      });
    });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}
