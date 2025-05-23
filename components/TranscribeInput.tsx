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
import axios from "axios";
import { toast } from "sonner";
import { useNotification } from "./Notification";
import { getAudioDuration } from "@/lib/audioFileHelper";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

interface ITranscriptStatus {
  success?: boolean;
  error?: string;
  status: string;
  transcriptId?: string;
}

const TranscribeInput = () => {
  const [inputType, setInputType] = useState("localVideo");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<ITranscriptStatus | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const formRef = useRef<HTMLFormElement | null>(null);
  const { user } = useUser();
    const userMinutes = user?.transcriptMinutes.toFixed(2);

  const resetForm = () => {
    formRef.current?.reset();
    setVideoUrl("");
    setFile(null);
    setSpeakers(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

const pollTranscriptStatus = async (id: string) => {
  let attempts = 0;
  const maxAttempts = 18;

  while (attempts < maxAttempts) {
    const { data }: { data: ITranscriptStatus } = await axios.get(
      "/api/poll-transcript",
      { params: { transcriptId: id } }
    );

    console.log(data);

    // ✅ Show live polling status to user
    setPollingStatus(data.status); 

    if (data.status === "completed") {
      setTranscript(data);
      setPollingStatus(null); // ✅ Stop showing loader
      toast.success("Transcript is ready!");
      return;
    } else if (data.status === "error") {
      setPollingStatus(null);
      toast.error("Error processing transcript.");
      return;
    }

    await new Promise((r) => setTimeout(r, 10000));
    attempts++;
  }

  setPollingStatus(null);
  toast.error("Polling timed out. Try again later.");
};


  const handleFileUpload = async () => {
    if (!file) return;

    if (!file) return;
    const durationInMinutes = await getAudioDuration(file);

    if (durationInMinutes > userMinutes) {
      toast.error("No Enough Minutes, Please Buy More");
      return;
      
    }

    try {
      setLoading(true);
      const durationInMinutes = await getAudioDuration(file);

      const response = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const { uploadUrl, fileUrl } = await response.json();

      if (!uploadUrl) {
        toast.error("Failed to get signed URL.");
        return;
      }

      setPublicUrl(fileUrl);

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/mpeg" },
        body: file,
      });

      const transcriptRes = await axios.post("/api/transcript-audio", {
        audioUrl: fileUrl,
        duration: durationInMinutes,
        speakers,
      });

      const { transcriptId, success, error } = transcriptRes.data;

      if (success) {
        toast.success("Transcript started! It’ll be ready shortly.");
        pollTranscriptStatus(transcriptId);
      } else {
        toast.error(error || "Something went wrong");
      }

      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
      setPublicUrl(null);
    }
  };

  const fetchYoutubeTranscript = async () => {
    toast.info("YouTube video transcription is coming soon...");
  };

  const handleAction = () => {
    if (inputType === "youtubeLink") {
      fetchYoutubeTranscript();
    } else {
      showNotification("Fetching audio transcript. Please wait...", "info");
      handleFileUpload();
    }
  };

  return (
    <>
      <Card className="w-full bg-white dark:bg-brand-dark border border-main">
        <CardContent className="mt-4">
          <form ref={formRef}>
            <div className="flex w-full items-center gap-1">
              <div className="space-y-1.5 w-48">
                <Select
                  onValueChange={(value) => setInputType(value)}
                  value={inputType}
                >
                  <SelectTrigger className="bg-brand-glow dark:bg-brand-dark text-text dark:text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-glow dark:bg-brand-dark">
                    <SelectItem value="youtubeLink">🔗 Youtube Link Coming Soon</SelectItem>
                    <SelectItem value="localVideo">🎥 Upload Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                {inputType === "youtubeLink" ? (
                  <Input
                    id="youtubeLink"
                    placeholder="Paste YouTube video link..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="text-black dark:text-white"
                  />
                ) : (
                  <Input
                    id={inputType}
                    type="file"
                    accept="audio/*"
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

        <CardFooter className="flex justify-end">
          <Button onClick={handleAction} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Get Transcript"}
          </Button>
        </CardFooter>
      </Card>

      {publicUrl && (
        <p className="mt-4 text-center text-muted-foreground">
          Upload complete. Processing transcript...
        </p>
      )}

      {/* {transcript && (
        transcript.status === "processing" ? (
           <p className="text-white bg-brand-glow p-2 rounded w-fit mx-auto mt-5 flex items-center gap-2">
            <Loader2 className="animate-spin" /> {transcript.status}...
          </p>
        ) : (
         
          <Button className="mt-4 mx-auto block">
            <Link href={`/dashboard/${transcript.transcriptId}`}>
              View Full Transcript
            </Link>
          </Button>
        )
      )} */}

      {(pollingStatus && pollingStatus !== "completed") || transcript?.status === "processing" ? (
  <p className="text-white bg-brand-glow p-2 rounded w-fit mx-auto mt-5 flex items-center gap-2">
    <Loader2 className="animate-spin" /> {pollingStatus || transcript?.status}...
  </p>
) : (
  transcript?.status === "completed" && (
    <Button className="mt-4 mx-auto block">
      <Link href={`/dashboard/${transcript?.transcriptId}`}>
        View Full Transcript
      </Link>
    </Button>
  )
)}

    </>
  );
};

export default TranscribeInput;
