import { NextResponse } from "next/server";
import multer from "multer";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { promisify } from "util";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Configure Multer
const upload = multer({
    dest: "uploads/",
})
const uploadMiddleware = upload.single("video");

export const config = {
    api: {
        bodyParser: false,
    },
};

const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        return result instanceof Error ? reject(result) : resolve(result);
      });
    });
  };

  export default async function Post(req, res) {
    await runMiddleware(req, res, uploadMiddleware);
  
    const videoPath = req.file.path;
    const audioPath = `uploads/${Date.now()}.mp3`;
  
    // Convert video to audio
    ffmpeg(videoPath)
      .output(audioPath)
      .on('end', async () => {
        // ✅ Audio is ready
  
        // TODO: Upload to cloud (Cloudinary, S3, or AssemblyAI's upload)
        // Example: const audioUrl = await uploadToCloudinary(audioPath)
  
        // Then send audioUrl to AssemblyAI for transcription
        // const transcript = await transcribeWithAssemblyAI(audioUrl)
  
        // Cleanup temp files
        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
  
        res.status(200).json({ message: 'Audio extracted', audioPath });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Conversion failed' });
      })
      .run();
  }