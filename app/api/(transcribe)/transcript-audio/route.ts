
import { client, s3 } from "@/lib/assemblyApi";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
  }

  const { duration, audioUrl, speakers } = await req.json();

  try {
    await connectToDatabase();

    const mongoUser = await User.findOne({ email: session.user.email });
    if (!mongoUser) {
      return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
    }

    const userId = mongoUser._id;

    if (mongoUser.transcriptMinutes < duration) {
      return NextResponse.json({ error: "Not enough minutes", success: false }, { status: 400 });
    }

  const encodedEmail = encodeURIComponent(session.user.email!);
const webhookUrl = `${process.env.NEXT_PUBLIC_URL}/api/assemblyAi/webhook?email=${encodedEmail}&duration=${duration}`;

const assemblyResponse = await client.transcripts.submit({
  audio: audioUrl,
  auto_chapters: true,
  speaker_labels: speakers,
  webhook_url: webhookUrl,
});


    // ✅ We don't expect 'completed' here — it's async.
    console.log("Transcript submitted:", assemblyResponse);

    // ✅ Optionally delete audio file now
    const url = new URL(audioUrl);
    const key = url.pathname.slice(1);
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    await s3.send(deleteCommand);

    return NextResponse.json({
      success: true,
      transcriptId: assemblyResponse.id,
      status: assemblyResponse.status,
      userId
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong while getting transcript";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}


