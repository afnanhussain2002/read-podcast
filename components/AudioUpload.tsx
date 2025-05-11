"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';


function AudioUpload() {
  // State variables to manage file, title, description, and upload status
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Maximum file size allowed for upload (70MB)


  // Handle file change and form submission
  const handleFileChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;


    setIsUploading(true);

    // Create a FormData object to send the file and other data
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send a POST request to the server to upload the Audio
      const response = await fetch('/api/transcript-audio', {
        method: 'POST',
        body: formData
      });

      if (!response.data) throw new Error("Upload Failed");

      const result = await response.data;
      if (result.public_id) {
        toast.success("Audio uploaded successfully!");
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Upload Failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Audio</h1>
      <form onSubmit={handleFileChange} className="space-y-4">
       
        <div>
          <label className="label">
            <span className="label-text">Audio File</span>
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Audio"}
        </button>
      </form>
    </div>
  );
}

export default AudioUpload;