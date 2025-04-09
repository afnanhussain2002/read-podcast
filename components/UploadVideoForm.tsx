// components/UploadForm.tsx
'use client';

import { useState } from 'react';
import { convertVideoToAudio } from '@/lib/convert';

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const audioBlob = await convertVideoToAudio(file);
    const formData = new FormData();
    formData.append('audio', new File([audioBlob], 'converted.mp3', { type: 'audio/mp3' }));

    const res = await fetch('/api/transcribe-audio', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setTranscript(data.transcript || 'No transcript received');
    setLoading(false);
  };

  return (
    <div className="p-4">
      <input type="file" accept="video/*" onChange={handleUpload} />
      {loading && <p>Transcribing...</p>}
      {transcript && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Transcript:</h2>
          <pre>{transcript}</pre>
        </div>
      )}
    </div>
  );
}
