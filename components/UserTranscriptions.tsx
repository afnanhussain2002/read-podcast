'use client';
import { ITranscript } from '@/dataTypes/transcribeDataTypes';
import React from 'react'

import { useEffect, useState } from 'react';

const UserTranscriptions = () => {
    const [transcriptions, setTranscriptions] = useState<ITranscript[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchTranscriptions = async () => {
        try {
          const res = await fetch('/api/user-transcript');
          const data = await res.json();
          setTranscriptions(data.transcriptions || []);
        } catch (error) {
          console.error('Error fetching transcriptions:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTranscriptions();
    }, []);
  
    if (loading) return <p>Loading...</p>;
  
    if (transcriptions.length === 0) return <p>No transcriptions found.</p>;
  return (
    <div>UserTranscriptions</div>
  )
}

export default UserTranscriptions