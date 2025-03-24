import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
