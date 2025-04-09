// app/api/transcribe-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function fileToBuffer(file: File): Promise<Buffer> {
  const reader = file.stream().getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

async function uploadToAssemblyAI(buffer: Buffer): Promise<string> {
  const res = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
    },
    body: buffer,
  });

  const data = await res.json();
  return data.upload_url;
}

async function requestTranscript(audioUrl: string): Promise<string> {
  const res = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  });

  const data = await res.json();
  return data.id;
}

async function pollTranscript(id: string): Promise<string> {
  const url = `https://api.assemblyai.com/v2/transcript/${id}`;

  while (true) {
    const res = await fetch(url, {
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
    });

    const json = await res.json();
    if (json.status === 'completed') return json.text;
    if (json.status === 'error') throw new Error(json.error);

    await new Promise((r) => setTimeout(r, 3000));
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('audio') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = await fileToBuffer(file);

  try {
    const uploadUrl = await uploadToAssemblyAI(buffer);
    const transcriptId = await requestTranscript(uploadUrl);
    const transcript = await pollTranscript(transcriptId);

    return NextResponse.json({ transcript });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
