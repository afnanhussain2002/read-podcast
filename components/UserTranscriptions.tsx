'use client';
import React from 'react'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';
import Star10 from './stars/s10';


type Transcript = {
    _id: string;
    transcript: string;
    createdAt: string;
    title: string;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

const UserTranscriptions = () => {
    const [transcriptions, setTranscriptions] = useState<Transcript[]>([]);
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

    console.log(transcriptions);
  
    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <Star10 size={100} strokeWidth={4} className="animate-spin text-blue-500" />
          </div>
        );
      } 
  
    if (transcriptions.length === 0) return <p>No transcriptions found.</p>;
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Transcriptions</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {transcriptions.map((t) => (
          <Card key={t._id} className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>{t.title || "Untitled Transcript"}</CardTitle>
              <CardDescription>{formatDate(t.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">
                {t.transcript}
                
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/transcripts/${t._id}`}>
                <Button className="w-full">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}

export default UserTranscriptions