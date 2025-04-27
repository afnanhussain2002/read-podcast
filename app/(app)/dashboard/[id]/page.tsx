"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/formatDate";
import { chapters, entity, ISpeaker } from "@/dataTypes/transcribeDataTypes";
import Chapters from "@/components/ShowChapters";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { getChapters, getEntities, getSummary } from "@/frontendFunctions/fetchData";
import Entities from "@/components/Entities";
import SingleMenu from "@/components/SingleMenu";


type Transcript = {
  _id: string;
  audioUrl: string;
  transcript: string;
  confidence: number;
  createdAt: string;
  chapters?: chapters[];
  entities?: entity[];
  summary?: string | null;
  speakers?: ISpeaker[];
};

const SingleTranscript = () => {
  const { id } = useParams();
  const [transcript, setTranscript] = useState<Transcript>({
    _id: "",
    audioUrl: "",
    transcript: "",
    confidence: 0,
    createdAt: "",
    speakers: [],
    chapters: [],
    entities: [],
    summary: null,
  });
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

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

  const handleGetChapters = async () => {
    try {
      setChaptersLoading(true);
      const chaptersData = await getChapters(transcript.audioUrl);
      if (chaptersData && Array.isArray(chaptersData)) {
        setTranscript((prev) => ({ ...prev, chapters: chaptersData }));
      }
    } catch (error) {
      console.error("Error getting chapters:", error);
    } finally {
      setChaptersLoading(false);
      window.location.reload();
    }
  };
  
  const handleGetEntities = async () => {
    try {
      setEntitiesLoading(true);
      const entitiesData = await getEntities(transcript.audioUrl);
      if (entitiesData && Array.isArray(entitiesData)) {
        setTranscript((prev) => ({ ...prev, entities: entitiesData }));
      }
    } catch (error) {
      console.error("Error getting entities:", error);
    } finally {
      setEntitiesLoading(false);
      window.location.reload();
    }
  };
  
  const handleGetSummary = async () => {
    try {
      setSummaryLoading(true);
      const summaryData = await getSummary(transcript.audioUrl);
      if (summaryData && typeof summaryData === "string") {
        setTranscript((prev) => ({ ...prev, summary: summaryData }));
        
      }
    } catch (error) {
      console.error("Error getting summary:", error);
    } finally {
      setSummaryLoading(false);
      window.location.reload();
    }
  };
  
  

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-4 gap-1">
    <div className="order-2">
    <SingleMenu/>
    </div>
    <div className="col-span-3 order-1">
      <Card id="fullTranscript" className="w-full max-w-5xl border-border dark:border-darkBorder dark:bg-brand-dark shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-brand-light p-5">
        <CardHeader>
          <CardTitle>
            {"Untitled Transcript"}
          </CardTitle>
          <CardDescription>
            Created at: {formatDate(transcript.createdAt)} • Confidence:{" "}
            {(transcript.confidence * 100).toFixed(2)}%
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ✅ Speakers Section */}
          {transcript?.speakers?.length ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                🎙️ Speaker Detection
              </h2>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-3">
                {transcript.speakers.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg text-blue-700">
                        Speaker {item.speaker}
                      </span>
                      <span className="text-sm text-gray-500">
                        🕒 {formatTime(item.start)} - {formatTime(item.end)}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {item.text}
                    </p>
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
       <div id="chapters">
       {transcript.chapters && transcript.chapters.length > 0 ? (
        <Chapters chapters={transcript.chapters} />
      ) : (
        <div className="flex justify-center max-w-5xl">
        <Button onClick={handleGetChapters} disabled={chaptersLoading} className="mt-10 w-3/6">
          {chaptersLoading ? "Loading Chapters..." : "Get Chapters"}
        </Button>

        </div>
      )}

       </div>

      {/* ✅ Entities Section */}
      <div id="entities">
      {transcript.entities && transcript.entities.length > 0 ? (
        <Entities entities={transcript.entities} />
      ) : (
        <div className="flex justify-center max-w-5xl">
        <Button onClick={handleGetEntities} disabled={entitiesLoading} className="mt-10 w-3/6">
          {entitiesLoading ? "Loading Entities..." : "Get Entities"}
        </Button>

        </div>
      )}

      </div>

      {/* ✅ Summary Section */}
      <div id="summary">

      {transcript.summary ? (
        <div className="mt-10 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-4">📝 Summary</h2>
        <div className="space-y-3">
          {transcript.summary?.split("- ").map((sentence, index) => 
            sentence.trim() && (
              <p key={index} className="leading-relaxed">
                - {sentence.trim()}
              </p>
            )
          )}
        </div>
      </div>
      ) : (
        <div className="flex justify-center max-w-5xl">
        <Button onClick={handleGetSummary} disabled={summaryLoading} className="mt-10 w-3/6">
          {summaryLoading ? "Loading Summary..." : "Get Summary"}
        </Button>

        </div>
      )}
      </div>

    </div>
    </div>
  );
};

export default SingleTranscript;
