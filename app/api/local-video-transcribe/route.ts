// app/api/upload-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const upload = multer({ dest: '/tmp' });

function runMiddleware(req: any, res: any, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      return result instanceof Error ? reject(result) : resolve(result);
    });
  });
}

// Convert file to readable stream
function fileToStream(filePath: string): Readable {
  return fs.createReadStream(filePath);
}

// Upload audio to AssemblyAI
async function uploadToAssemblyAI(audioPath: string) {
  const res = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
    },
    body: fileToStream(audioPath),
  });

  const data = await res.json();
  return data.upload_url;
}

// Send for transcription
async function transcribeFromAssemblyAI(audioUrl: string) {
  const res = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  });

  const data = await res.json();
  return data.id;
}

// Poll transcript result
async function pollTranscript(id: string) {
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${id}`;
  let transcriptData;

  while (true) {
    const res = await fetch(pollingEndpoint, {
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
    });

    transcriptData = await res.json();
    if (transcriptData.status === 'completed') break;
    if (transcriptData.status === 'error') throw new Error(transcriptData.error);
    await new Promise((r) => setTimeout(r, 3000)); // wait 3s
  }

  return transcriptData.text;
}

// Handle POST request
export async function POST(req: NextRequest, res: any) {
  const formData = await req.formData();
  const videoFile = formData.get('video') as File;

  // Save video to tmp
  const tempVideoPath = `/tmp/${videoFile.name}`;
  const buffer = Buffer.from(await videoFile.arrayBuffer());
  fs.writeFileSync(tempVideoPath, buffer);

  const audioPath = `/tmp/${Date.now()}.mp3`;

  // Convert video to audio
  await new Promise<void>((resolve, reject) => {
    ffmpeg(tempVideoPath)
      .output(audioPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });

  // Upload audio to AssemblyAI
  const audioUrl = await uploadToAssemblyAI(audioPath);

  // Request transcription
  const transcriptId = await transcribeFromAssemblyAI(audioUrl);

  // Poll and get result
  const finalTranscript = await pollTranscript(transcriptId);

  // Cleanup
  fs.unlinkSync(tempVideoPath);
  fs.unlinkSync(audioPath);

  return NextResponse.json({ transcript: finalTranscript });
}
