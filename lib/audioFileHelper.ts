
export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
          // Convert duration from seconds to minutes and round to 2 decimal places
          const durationInMinutes = parseFloat((audio.duration / 60).toFixed(2));
          resolve(durationInMinutes);
          // Clean up the object URL
          URL.revokeObjectURL(audio.src);
      };
      audio.src = URL.createObjectURL(file);
  });
}



