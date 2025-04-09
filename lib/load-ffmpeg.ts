// lib/load-ffmpeg.ts
import { createFFmpeg } from '@ffmpeg/ffmpeg';

export const ffmpeg = createFFmpeg({ log: true });

export const loadFFmpeg = async () => {
  if (!ffmpeg.isLoaded()) await ffmpeg.load();
  return ffmpeg;
};
