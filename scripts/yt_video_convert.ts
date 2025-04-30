import fetch from "node-fetch";
import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Utility function to get video duration in minutesexport async function getVideoDuration(videoUrl: string): Promise<number> {
    export async function getVideoDuration(videoUrl: string): Promise<number> {
        console.log("videoUrl", videoUrl);
        try {
          const info = await ytdl.getInfo(videoUrl);
          console.log("info", info);
          const durationInSeconds = parseInt(info.videoDetails.lengthSeconds, 10);
          return durationInSeconds / 60; // Convert to minutes
        } catch (error: any) {
          console.error("Failed to get video info:", error);
          throw new Error(`Failed to get video duration: ${error.message}`);
        }
      }

// Utility function to download and convert audio to MP3
export async function downloadAndConvertAudio(videoUrl: string): Promise<string> {
  const uniqueFilename = uuidv4();
  const outputFilePath = path.join("/tmp", `${uniqueFilename}.mp3`);

  try {
    await new Promise<void>((resolve, reject) => {
      const stream = ytdl(videoUrl, { filter: "audioonly" });

      ffmpeg(stream)
        .audioCodec("libmp3lame")
        .format("mp3")
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .save(outputFilePath);
    });

    if (!fs.existsSync(outputFilePath)) {
      throw new Error("Audio file was not created.");
    }

    return outputFilePath;
  } catch (error: any) {
    throw new Error(`Failed to download and convert audio: ${error.message}`);
  }
}

// Utility function to upload audio to AssemblyAI
export async function uploadToAssemblyAI(filePath: string): Promise<string> {
  const assemblyAiApiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!assemblyAiApiKey) {
    throw new Error("AssemblyAI API key is not set in environment variables.");
  }

  const fileStream = fs.createReadStream(filePath);

  try {
    const response = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: assemblyAiApiKey,
      },
      body: fileStream,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`AssemblyAI upload failed: ${data.error || "Unknown error"}`);
    }

    return data.upload_url;
  } catch (error: any) {
    throw new Error(`Failed to upload audio to AssemblyAI: ${error.message}`);
  }
}
