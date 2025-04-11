import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const image = formData.get("image") as File | null;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // Upload image if present
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `profile_images/${uuidv4()}`;

      const uploadedImage = await cloudinary.v2.uploader.upload_stream({
        folder: "profile_images",
        public_id: fileName,
        resource_type: "image",
      });

      // Wrap upload_stream in a Promise
      imageUrl = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "profile_images",
            public_id: uuidv4(),
          },
          (error, result) => {
            if (error) return reject(error);
            if (result?.secure_url) resolve(result.secure_url);
            else reject("Upload failed");
          }
        );

        stream.end(buffer);
      });
    }

    await User.create({
      email,
      password,
      profileImage: imageUrl || null,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
