"use client";
import React, { useState } from "react";
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


const TranscribeInput = () => {
  const [inputType, setInputType] = useState("youtubeLink");
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState(false);
  const [detectSpeakers, setDetectSpeakers] = useState({});

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

      const jsonSizeInBytes = new Blob([JSON.stringify(data)]).size;
      console.log(`Data size: ${(jsonSizeInBytes / 1024).toFixed(2)} KB`);

      console.log(data);
      setDetectSpeakers(speakersText);
      setTranscript(data.transcript || "No transcript available.");
      localStorage.setItem("transcript", JSON.stringify(data) || "No transcript available.");
    } catch (error) {
      setTranscript("Failed to fetch transcript.");
    }
    setLoading(false);
  };

  return (
    <Card className="w-full bg-white dark:bg-secondaryBlack border-border border-main">
      <CardContent className="mt-4">
        <form>
          <div className="flex w-full items-center gap-1">
            <div className="space-y-1.5 w-48">
              <Select onValueChange={(value) => setInputType(value)}>
                <SelectTrigger className="bg-bw text-text" id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtubeLink">🔗 Youtube Link</SelectItem>
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

              {inputType === "localVideo" && (
                <Input id="localVideo" type="file" accept="video/*" />
              )}

              {inputType === "localAudio" && (
                <Input id="localAudio" type="file" accept="audio/*" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
        <Button variant="default" onClick={fetchTranscript} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Get Transcript"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranscribeInput;
