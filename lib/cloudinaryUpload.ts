import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

async function uploadAudio(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video", // Audio is considered "video" in Cloudinary
    });
    console.log("Audio URL:", result.secure_url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

uploadAudio("path-to-your-audio.mp3");
