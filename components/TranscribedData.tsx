"use client"
import { ITranscript } from '@/dataTypes/transcribeDataTypes';
import React, { useEffect, useState } from 'react'


const TranscribedData = () => {

   const [transcript, setTranscript] = useState<ITranscript>()

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
  
  console.log(transcript);


  return (
    <>
    {transcript && (
      <div className="text-center mt-6">
        <p className="text-xl font-medium mb-4 text-green-600">✅ Your transcript is ready!</p>
        <a
          href={`/dashboard/${transcript._id}`}
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Full Transcript
        </a>
      </div>
    )}
    
    </>
    
  )
}

export default TranscribedData