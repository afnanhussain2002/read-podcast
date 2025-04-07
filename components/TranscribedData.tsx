import React, { useEffect, useState } from 'react'

const TranscribedData = () => {

   const [transcript, setTranscript] = useState(null)

   useEffect(() => {
    const storedTranscript = localStorage.getItem('transcript');
    if (storedTranscript) {
      try {
        const parsedTranscript = JSON.parse(storedTranscript);
        setTranscript(parsedTranscript);
      } catch (error) {
        console.error('Failed to parse transcript from localStorage:', error);
      }
    }
  }, []);


  return (
    <div>TranscribedData</div>
  )
}

export default TranscribedData