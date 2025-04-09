// utils/convert-to-audio.ts
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import os from 'os';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function convertVideoToAudio(videoPath: string): Promise<string> {
  const audioPath = path.join(os.tmpdir(), `${Date.now()}-output.mp3`);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .toFormat('mp3')
      .on('end', () => resolve(audioPath))
      .on('error', (err) => reject(err))
      .save(audioPath);
  });
}
