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
import { toast } from "sonner";
import { useNotification } from "./Notification";


type TranscriptResponse = {
  transcript?: string;
  error?: string;
};


const TranscribeInput = () => {
  const [inputType, setInputType] = useState("youtubeLink");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState(false);
  const { showNotification } = useNotification();



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
    formData.append("speakers", String(speakers));
  
    try {
      setLoading(true);
      const response = await fetch("/api/local-video-transcribe", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // If the backend sends a JSON with `error` field
        toast.error(data?.error || "Failed to fetch transcript. Please try again.");
        return;
      }
  
      setTranscript(data);
      resetForm(); 
      toast.success("Transcript successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setTranscript({ error: message });
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscript = async () => {
    if (!videoUrl.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/transcriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, speakers }),
      });
      const data = await response.json();
      console.log("transcript data==========", data);

      if (!response.ok) {
        // If the backend sends a JSON with `error` field
        toast.error(data?.error || "Failed to fetch transcript. Please try again.");
        return;
      }

      setTranscript(data);


      toast.success("Transcript successfully!");
      resetForm(); // ✅ reset after success
     
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setTranscript({ error: message });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (inputType === "youtubeLink") {
      showNotification("Fetching youtube video transcript. Please wait...", "info");
      fetchTranscript();
    } else {
      showNotification("Fetching local video transcript. Please wait...", "info");
      handleFileUpload();
    }
  };


  return (
    <>
    <Card className="w-full bg-white dark:bg-brand-dark border-border border-main">
      <CardContent className="mt-4">
        <form ref={formRef}>
          <div className="flex w-full items-center gap-1">
            <div className="space-y-1.5 w-48">
              <Select onValueChange={(value) => setInputType(value)} value={inputType}>
                <SelectTrigger className=" bg-brand-glow dark:bg-brand-dark text-text dark:text-white" id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-brand-glow dark:bg-brand-dark">
                  <SelectItem value="youtubeLink" className="">🔗 Youtube Link</SelectItem>
                  <SelectItem value="localVideo">🎥 Local Video</SelectItem>
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
       
   

      <CardFooter className="flex justify-end">
        <Button variant="default" onClick={handleAction} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Get Transcript"}
        </Button>
      </CardFooter>
    </Card>

    {transcript?.error && (
  <p className="text-red-500">Error: {transcript.error}</p>
)}

{transcript?.transcript && (
  <TranscribedData transcript={transcript.transcript} />
)}


    </>
  );
};

export default TranscribeInput;
