"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";


export default function Transcriber() {
  const { theme } = useTheme();
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


      console.log(data);
      setDetectSpeakers(speakersText);
      setTranscript(data.transcript || "No transcript available.");
    } catch (error) {
      setTranscript("Failed to fetch transcript.");
    }
    setLoading(false);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      <Card className={`w-full max-w-lg p-6 border-4 shadow-xl transition-all duration-300 ${theme === "dark" ? "border-white bg-gray-800" : "border-black bg-white"}`}>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold">YouTube Video Transcriber</h2>
          <Input
            type="text"
            placeholder="Paste YouTube video link..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={`border-4 rounded-lg px-4 py-2 text-lg focus:outline-none transition-all duration-300 ${theme === "dark" ? "border-white bg-gray-700 text-white" : "border-black bg-white text-black"}`}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="speakers"
              checked={speakers}
              onChange={() => setSpeakers(!speakers)}
              className="w-5 h-5"
            />
            <label htmlFor="speakers" className="text-lg">Enable Speaker Detection</label>
          </div>
          <Button
            onClick={fetchTranscript}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg border-4 transition-all duration-300 ${theme === "dark" ? "bg-white text-black border-white hover:bg-gray-300" : "bg-black text-white border-black hover:bg-gray-800"}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Get Transcript"}
          </Button>
        </CardContent>
      </Card>
      {}
      {transcript && (
        <div className={`p-4 mt-5 border-4 rounded-lg h-80 overflow-y-auto transition-all duration-300 ${theme === "dark" ? "border-white bg-gray-700 text-white" : "border-black bg-gray-200 text-black"}`}>
          <p className="text-lg">{transcript}</p>
        </div>
      )}
    </div>
  );
}
