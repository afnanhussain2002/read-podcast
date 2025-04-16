'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star10 } from "lucide-react";

type Transcript = {
  _id: string;
  transcript: string;
  createdAt: string;
  chapters: {
    gist?: string;
    headline?: string;
    start?: number;
    end?: number;
  }[];
  confidence: number;
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function SingleTranscriptPage() {
  const { id } = useParams();
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const res = await fetch(`/api/single-transcribe/${id}`);
        const data = await res.json();
        setTranscript(data.transcript);
      } catch (err) {
        console.error("Failed to fetch transcript", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Star10 size={100} strokeWidth={4} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!transcript) {
    return <div className="text-center mt-10 text-red-500">Transcript not found.</div>;
  }

  return (
    <main className="flex justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{transcript.chapters[0]?.gist}</CardTitle>
          <CardDescription>
            Created at: {formatDate(transcript.createdAt)} • Confidence:{" "}
            {(transcript.confidence * 100).toFixed(2)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base whitespace-pre-line leading-relaxed">
            {transcript.transcript}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
