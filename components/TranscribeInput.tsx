/* "use client";
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


type TranscriptResponse = {
  transcript?: string;
  error?: string;
  success?: boolean;
  transcriptId?: string;
};

const TranscribeInput = () => {
  const [inputType, setInputType] = useState("localVideo");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState(false);
  const { showNotification } = useNotification();
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  const resetForm = () => {
    formRef.current?.reset();
    setVideoUrl("");
    setFile(null);
    setSpeakers(false);
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    console.log("selectedFile", selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  

  const handleFileUpload = async () => {
    if (!file) return;
    const durationInMinutes = await getAudioDuration(file);

    try {
      setLoading(true);

      // Step 1: Get signed URL from backend
      const response = await fetch("/api/upload-url", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
       
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { uploadUrl, fileUrl } = await response.json();
      console.log("S3 Signed URL:", uploadUrl);
      console.log("Public File URL:", fileUrl);

      if (!uploadUrl) {
        toast.error("Failed to get signed URL.");
        return;
      }

      setPublicUrl(fileUrl);


      // ✅ Step 2: Upload file to S3 using signed URL
    const s3Response = await fetch(uploadUrl, {
  method: "PUT",
  headers: {
    "Content-Type": "audio/mpeg",
  },
  body: file,
});

    console.log("s3Response", s3Response);


      // Step 3: Send the public file URL to your backend for transcription
      const getTranscript = await axios.post("/api/transcript-audio", {
        audioUrl: fileUrl,
        speakers,
        duration: durationInMinutes,
      });

      const transcriptData = await getTranscript.data;
      console.log("Transcript Data:", transcriptData);

      setPublicUrl(null);

      setTranscript(transcriptData);
      resetForm();
      toast.success("Transcript successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setTranscript({ error: message });
    } finally {
      setLoading(false);
    }
  };

  const fetchYoutubeTranscript = async () => {
    toast.info("Youtube Video Transcript is coming soon....");
  };

  const handleAction = () => {
    if (inputType === "youtubeLink") {
      // showNotification("Fetching youtube video transcript. Please wait...", "info");
      fetchYoutubeTranscript();
    } else {
      showNotification("Fetching audio transcript. Please wait...", "info");
      handleFileUpload();
    }
  };

  console.log("transcript", transcript);

  return (
    <>
      <Card className="w-full bg-white dark:bg-brand-dark border-border border-main">
        <CardContent className="mt-4">
          <form ref={formRef}>
            <div className="flex w-full items-center gap-1">
              <div className="space-y-1.5 w-48">
                <Select
                  onValueChange={(value) => setInputType(value)}
                  value={inputType}
                >
                  <SelectTrigger
                    className=" bg-brand-glow dark:bg-brand-dark text-text dark:text-white"
                    id="framework"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-glow dark:bg-brand-dark">
                    <SelectItem value="youtubeLink" className="">
                      🔗 Youtube Link Coming Soon
                    </SelectItem>
                    <SelectItem value="localVideo">🎥 Upload Audio</SelectItem>
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
                    accept={"audio/*"}
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

      {publicUrl && (
        <div className="mt-4">
          <p>Almost Done, Please wait...</p>
        </div>
      )}

      {transcript?.error && (
        <p className="text-red-500">Error: {transcript.error}</p>
      )}

      {transcript?.success && (
        <Button className="mt-4">
          <Link href={`/dashboard/${transcript.transcriptId}`}>
            View Full Transcript
          </Link>
        </Button>
      )}
    </>
  );
};

export default TranscribeInput;
 */

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

const TranscribeInput = () => {
  const [inputType, setInputType] = useState("localVideo");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const formRef = useRef<HTMLFormElement | null>(null);
  // const router = useRouter();

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
    const durationInMinutes = await getAudioDuration(file);

    try {
      setLoading(true);

      const response = await fetch("/api/upload-url", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { uploadUrl, fileUrl } = await response.json();

      if (!uploadUrl) {
        toast.error("Failed to get signed URL.");
        return;
      }

      setPublicUrl(fileUrl);

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "audio/mpeg",
        },
        body: file,
      });

      const transcriptRes = await axios.post("/api/transcript-audio", {
        audioUrl: fileUrl,
        speakers,
        duration: durationInMinutes,
      });

      const { transcriptId, success, error } = transcriptRes.data;

      if (success) {
        toast.success("Transcript started! It’ll be ready shortly.");
        setTranscript(transcriptId);
      } else {
        toast.error(error || "Something went wrong");
      }

      resetForm();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
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
      <Card className="w-full bg-white dark:bg-brand-dark border-border border-main">
        <CardContent className="mt-4">
          <form ref={formRef}>
            <div className="flex w-full items-center gap-1">
              <div className="space-y-1.5 w-48">
                <Select
                  onValueChange={(value) => setInputType(value)}
                  value={inputType}
                >
                  <SelectTrigger className=" bg-brand-glow dark:bg-brand-dark text-text dark:text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-glow dark:bg-brand-dark">
                    <SelectItem value="youtubeLink">
                      🔗 Youtube Link Coming Soon
                    </SelectItem>
                    <SelectItem value="localVideo">🎥 Upload Audio</SelectItem>
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
                    accept={"audio/*"}
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

      {publicUrl && (
        <div className="mt-4">
          <p>Almost Done, Please wait...</p>
        </div>
      )}
{transcript && (
        <Button className="mt-4">
          <Link href={`/dashboard/${transcript}`}>
            View Full Transcript
          </Link>
        </Button>
      )}
      
    </>
  );
};

export default TranscribeInput;
