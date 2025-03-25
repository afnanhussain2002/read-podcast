import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function cloudinaryUpload(filePath: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video", // Cloudinary treats audio as "video"
    });

    console.log("Audio uploaded:", result.secure_url);
    return result.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}
