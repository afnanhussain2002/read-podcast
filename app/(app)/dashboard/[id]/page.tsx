"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDate, formatTime } from '@/lib/formatDate';
import { chapters, entity, ISpeaker } from '@/dataTypes/transcribeDataTypes';
import Chapters from '@/components/ShowChapters';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { getChapters, getEntities } from '@/frontendFunctions/fetchData';
import Entities from '@/components/Entities';


type Transcript = {
  _id: string;
  audioUrl: string;
  transcript: string;
  confidence: number;
  createdAt: string;
  chapters?: chapters[]
  entities?: entity[]
  summary?: string
  speakers?: ISpeaker[];
};

const SingleTranscript = () => {
  const { id } = useParams();
  const [transcript, setTranscript] = useState<Transcript>({
    _id: '',
    audioUrl: '',
    transcript: '',
    confidence: 0,
    createdAt: '',
    speakers: [],
    
  });
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


  if (loading) {
    return <Loader/>
  }

  return (
    <>
    <Card className="w-full max-w-5xl border-border dark:border-darkBorder dark:bg-brand-dark shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-brand-light p-5">
      <CardHeader>
        <CardTitle>{transcript.chapters[0]?.gist || "Untitled Transcript"}</CardTitle>
        <CardDescription>
          Created at: {formatDate(transcript.createdAt)} • Confidence: {(transcript.confidence * 100).toFixed(2)}%
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ Speakers Section */}
        {transcript?.speakers?.length ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">🎙️ Speaker Detection</h2>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-3">
              {transcript.speakers.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-lg text-blue-700">Speaker {item.speaker}</span>
                    <span className="text-sm text-gray-500">
                      🕒 {formatTime(item.start)} - {formatTime(item.end)}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          
          <div className="text-base leading-relaxed space-y-4">
            {/* ✅ Transcript Section */}
            {transcript.transcript
              .split(/(?<=[.?!])\s+(?=[A-Z])/g)
              .map((para, index) => (
                <p key={index} className="indent-6">
                  {para.trim()}
                </p>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
         {/* ✅ Chapters Section */}
       
         {transcript.chapters ? (
           <Chapters chapters={transcript.chapters} />

         ): (
          <Button onClick={() => getChapters(transcript.audioUrl)}>Get Chapters</Button>
         )
         }

         {/* ✅ Entities Section */}
         {transcript.entities && transcript.entities.length > 0 ?  (
           <Entities entities={transcript.entities} />

         ): (
          <Button onClick={() => getEntities(transcript.audioUrl)}>Get Entities</Button>
         )
         }
         <p>{transcript.summary}</p>
    
    </>
  );
};

export default SingleTranscript;
