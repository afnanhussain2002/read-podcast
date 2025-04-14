"use client"
import { ITranscript } from '@/dataTypes/transcribeDataTypes';
import React, { useEffect, useState } from 'react'
import { Card } from './ui/card';

const TranscribedData = () => {

   const [transcript, setTranscript] = useState<ITranscript>()
   const [transcriptId, setTranscriptId] = useState<string>('');

  useEffect(() => {
    const fetchTranscript = async () => {
      const storedTranscript = localStorage.getItem('transcript');
      if (!storedTranscript) return;
  
      try {
        const parsed = JSON.parse(storedTranscript);
        const id = parsed?.transcript;
        if (!id) return;
  
        const response = await fetch(`/api/single-transcribe/${id}`);
        const data = await response.json();
        setTranscript(data);
       
      } catch (error) {
        console.error('Error fetching transcript:', error);
      }
    };
  
    // Initial load
    fetchTranscript();
  
    // Listen for updates
    const handleUpdate = () => {
      fetchTranscript();
    };
  
    window.addEventListener("transcript-updated", handleUpdate);
  
    return () => {
      window.removeEventListener("transcript-updated", handleUpdate);
    };
  }, []);
  
  

  console.log(transcriptId);
  console.log(transcript);

   // Convert ms to mm:ss format
   const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  return (
    <section className='border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[100px]'>
    <Card className="p-4 max-w-xl mx-auto mt-10 bg-">
      <h1 className="nb-text text-2xl mb-4">📝 Recent Transcript</h1>
      

      {transcript?.speakers?.length ? (
        <div className="nb-card nb-shadow mt-6 p-4">
        <h2 className="nb-text text-xl mb-4">🎙️ Speaker Detection</h2>
        <div className="max-h-[400px] overflow-y-auto space-y-4">
          {transcript.speakers.map((item, index) => (
            <div key={index} className="nb-text border-l-4 border-black pl-3 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-lg">Speaker {item.speaker}</span>
                <span className="text-sm text-gray-600">
                  🕒 {formatTime(item.start)} - {formatTime(item.end)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      ) : (
      <div>
          <p className="mb-2 text-xl">
        <strong>Transcript:</strong> {transcript?.transcript || 'No transcript found.'}
      </p>
      <p className="text-xl">
        <strong>Confidence:</strong> {transcript?.confidence ? `${transcript.confidence * 100}%` : 'N/A'}
      </p>
      </div>
      )}
    </Card>

    </section>
  )
}

export default TranscribedData