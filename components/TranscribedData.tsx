import { ITranscript } from '@/dataTypes/transcribeDataTypes';
import React, { useEffect, useState } from 'react'

const TranscribedData = () => {

   const [transcript, setTranscript] = useState<ITranscript>()

   useEffect(() => {
    const storedTranscript = localStorage.getItem('transcript');
    if (storedTranscript) {
      try {
        const parsedTranscript = JSON.parse(storedTranscript) 
        setTranscript(parsedTranscript.createdTranscript);
      } catch (error) {
        console.error('Failed to parse transcript from localStorage:', error);
      }
    }
  }, []);
  console.log(transcript);


  return (
    <div className="nb-card nb-shadow p-4 max-w-xl mx-auto mt-10">
      <h1 className="nb-text text-2xl mb-4">📝 Transcription Result</h1>
      <p className="nb-text mb-2">
        <strong>Transcript:</strong> {transcript?.transcript || 'No transcript found.'}
      </p>
      <p className="nb-text">
        <strong>Confidence:</strong> {transcript?.confidence ? `${transcript.confidence * 100}%` : 'N/A'}
      </p>
    </div>
  )
}

export default TranscribedData