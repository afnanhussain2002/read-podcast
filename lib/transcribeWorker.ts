import { Worker } from "bullmq";
import { connectToDatabase } from "./db";
import Transcript from "@/models/Transcript";
import User from "@/models/User";
import { s3 } from "@/lib/assemblyApi";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { redisConnection } from "./redis";
import { chapters, ISpeaker } from "@/dataTypes/transcribeDataTypes";

interface ITranscriptBody {
    id: string;
    audio_url: string;
    text: string;
    confidence: number;
    utterances: ISpeaker[];
    chapters: chapters[];
}

interface JobData {
  transcriptId: string;
  email: string | null;
  duration: number;
  body: ITranscriptBody;
}

// Main worker
const worker = new Worker(
  "transcribeQueue",
  async (job) => {
    const { transcriptId, email, duration, body }: JobData = job.data;

    await connectToDatabase();

    const {
      id,
      audio_url,
      text,
      confidence,
      utterances,
      chapters,
    } = body;

    // ✅ 1. Prevent duplicate saves
    const existing = await Transcript.findOne({ transcriptId: id });
    if (existing) {
      console.log("⏩ Transcript already exists. Skipping.");
      return;
    }

    // ✅ 2. Create new transcript
    const transcript = await Transcript.findOneAndUpdate(
  { transcriptId: transcriptId },
  {
    $set: {
      transcript: text,
      confidence,
      speakers: utterances?.map((u: ISpeaker) => ({
        speaker: u.speaker,
        text: u.text,
        start: u.start,
        end: u.end,
      })),
      chapters,
      processing: false, // done processing
    },
  },
  { upsert: true, new: true }
);


    // ✅ 3. Deduct user minutes (if applicable)
    if (email && duration) {
      const user = await User.findOne({ email });
      if (user) {
        user.transcriptMinutes -= duration;
        await user.save();

        transcript.ownerId = user._id;
        await transcript.save();
      }
    }

    // ✅ 4. Delete audio from S3
    if (audio_url) {
      const url = new URL(audio_url);
      const key = url.pathname.slice(1);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      });

      const res = await s3.send(deleteCommand);
      if (res.$metadata.httpStatusCode === 204) {
        console.log("✅ Audio file deleted from S3.");
      } else {
        console.warn("⚠️ Failed to delete S3 file. Status:", res.$metadata.httpStatusCode);
      }
    }

    console.log("✅ Job processed for transcript:", id);
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed with error:`, err);
});
