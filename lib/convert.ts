// lib/convert.ts
import { fetchFile } from '@ffmpeg/ffmpeg';
import { loadFFmpeg } from './load-ffmpeg';

export const convertVideoToAudio = async (videoFile: File): Promise<Blob> => {
  const ffmpeg = await loadFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'output.mp3';

  ffmpeg.FS('writeFile', inputName, await fetchFile(videoFile));
  await ffmpeg.run('-i', inputName, outputName);
  const data = ffmpeg.FS('readFile', outputName);

  return new Blob([data.buffer], { type: 'audio/mp3' });
};
