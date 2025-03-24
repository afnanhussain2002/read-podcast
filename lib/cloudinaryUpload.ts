import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

async function uploadAudio(filePath: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video", // Audio is treated as "video" in Cloudinary
    });

    console.log("Audio URL:", result.secure_url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

// Call function
uploadAudio("path-to-your-audio.mp3");
