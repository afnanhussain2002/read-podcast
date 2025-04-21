'use client';
import React from 'react'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';
import Star10 from './stars/s10';
import Loader from './Loader';
import DeleteAllTranscriptsButton from './DeleteAllTranscript';


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
       return <Loader/>
      } 
  
    if (transcriptions.length === 0) return <p>No transcriptions found.</p>;
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Transcriptions</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {transcriptions.map((t) => (
          <Card key={t._id} className="border-border dark:border-darkBorder dark:bg-brand-dark shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-brand-light p-5">
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
              <Link href={`/dashboard/${t._id}`}>
                <Button className="w-full">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <DeleteAllTranscriptsButton/>
    </main>
  )
}

export default UserTranscriptions