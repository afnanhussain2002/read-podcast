"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import TranscribedData from "./TranscribedData";
import { useUser } from "@/hooks/useUser";
import Loader from "./Loader";
import { Badge } from "./ui/badge";
import Link from "next/link";



const TranscribeInput = () => {
  const [inputType, setInputType] = useState("youtubeLink");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState(false);
  const [detectSpeakers, setDetectSpeakers] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [transcriptId, setTranscriptId] = useState("");
  const { user, isLoading } = useUser();



  const formRef = useRef<HTMLFormElement | null>(null);

  const resetForm = () => {
    formRef.current?.reset();
    setVideoUrl("");
    setFile(null);
    setSpeakers(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("speakers", String(speakers)); // Convert boolean to string

    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/local-video-transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed.");
      }

      const data = await response.json();
      const speakersText = data.speakers || [];

      setDetectSpeakers(speakersText);
      setTranscript(data.transcript || "No transcript available.");
      setTranscriptId(data.transcriptId);
      // localStorage.setItem("transcript", JSON.stringify(data));
      window.dispatchEvent(new Event("transcript-updated"));

      resetForm(); // ✅ reset after success
     
    } catch (err: any) {
      setError(err.message);
      setTranscript("Failed to fetch transcript.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscript = async () => {
    if (!videoUrl.trim()) return;
    setLoading(true);
    setTranscript("");
    try {
      const response = await fetch("/api/transcriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, speakers }),
      });
      const data = await response.json();
      const speakersText = data.speakers || [];

      setDetectSpeakers(speakersText);
      setTranscript(data.transcript || "No transcript available.");
      setTranscriptId(data.transcriptId);
      // localStorage.setItem("transcript", JSON.stringify(data));
      window.dispatchEvent(new Event("transcript-updated"));

      resetForm(); // ✅ reset after success
     
    } catch (error) {
      setTranscript("Failed to fetch transcript.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (inputType === "youtubeLink") {
      fetchTranscript();
    } else {
      handleFileUpload();
    }
  };

  console.log("transcriptId",transcriptId);
  console.log("transcript data",transcript);

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
    <Card className="w-full bg-white dark:bg-brand-dark border-border border-main">
      <CardContent className="mt-4">
        <form ref={formRef}>
          <div className="flex w-full items-center gap-1">
            <div className="space-y-1.5 w-48">
              <Select onValueChange={(value) => setInputType(value)} value={inputType}>
                <SelectTrigger className="bg-bw text-text dark:text-white" id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtubeLink" className="">🔗 Youtube Link</SelectItem>
                  <SelectItem value="localVideo">🎥 Local Video</SelectItem>
                  <SelectItem value="localAudio">🎧 Local Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1.5">
              {inputType === "youtubeLink" && (
                <Input
                  id="youtubeLink"
                  placeholder="Paste YouTube video link..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="text-black dark:text-white"
                />
              )}

              {(inputType === "localVideo" || inputType === "localAudio") && (
                <Input
                  id={inputType}
                  type="file"
                  accept={inputType === "localVideo" ? "video/*" : "audio/*"}
                  onChange={handleFileChange}
                  className="text-black dark:text-white"
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <input
              type="checkbox"
              id="speakers"
              checked={speakers}
              onChange={() => setSpeakers(!speakers)}
              className="w-5 h-5"
            />
            <Label htmlFor="speakers" className="text-lg">
              Enable Speaker Detection
            </Label>
          </div>
        </form>
      </CardContent>
        <div className="flex gap-2 ml-5 flex-wrap">
        <Badge  variant={"neutral"} >Note: </Badge>
        {user?.transcriptMinutes} minutes of transcription available.
        <Badge className="text-darkBg"><Link href="/#pricing"> Buy More</Link> </Badge>
        </div>

      <CardFooter className="flex justify-end">
        <Button variant="default" onClick={handleAction} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Get Transcript"}
        </Button>
      </CardFooter>
    </Card>

    <TranscribedData transcript={transcript} />
    
    </>
  );
};

export default TranscribeInput;
