import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "No YouTube URL provided" }, { status: 400 });
    }

    // Run Python script using child_process.spawn
    const pythonProcess = spawn("python", ["./scripts/download_audio.py", videoUrl]);

    let output = "";
    let error = "";

    // Capture Python script output
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Capture Python script errors
    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    // Wait for the process to finish
    return new Promise((resolve) => {
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(NextResponse.json({ message: "Audio conversion successful", output }));
        } else {
          resolve(NextResponse.json({ error: "Failed to process video", details: error }, { status: 500 }));
        }
      });
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}
