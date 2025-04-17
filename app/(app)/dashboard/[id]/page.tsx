"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDate } from '@/lib/formatDate';

type Transcript = {
    _id: string;
    transcript: string;
    confidence: number;
    createdAt: string;
    chapters: {
      gist?: string;
      headline?: string;
      start?: number;
      end?: number;
    }[];
  };

const SingleTranscript = () => {
    const { id } = useParams();
    const [transcript, setTranscript] = useState<Transcript>({ _id: '',
        transcript: '',
        confidence: 0,
        createdAt: '',
        chapters: []});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTranscript = async () => {
          try {
            const res = await fetch(`/api/single-transcribe/${id}`);
            const data = await res.json();
            setTranscript(data);
          } catch (err) {
            console.error("Error loading transcript:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchTranscript();
      }, [id]);
      console.log(transcript);
  return (
    <>
    <div>SingleTranscript: {id}</div>
    <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{transcript.chapters[0]?.gist || "Untitled Transcript"}</CardTitle>
          <CardDescription>
            Created at: {formatDate(transcript.createdAt)} • Confidence: {(transcript.confidence * 100).toFixed(2)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base whitespace-pre-line leading-relaxed">
            {transcript.transcript}
          </p>
        </CardContent>
      </Card>
    
    </>
  )
}

export default SingleTranscript