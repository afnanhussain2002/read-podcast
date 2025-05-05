// models/TranscriptJob.ts
import { Schema, model, models } from "mongoose";

const transcriptJobSchema = new Schema(
  {
    videoUrl: { type: String, required: true },
    audioUrl: { type: String }, // filled after download
    status: {
      type: String,
      enum: ["queued", "processing", "transcribing", "completed", "failed"],
      default: "queued",
    },
    error: { type: String, default: null },
    videoMinutes: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    assemblyTranscriptId: { type: String }, // returned by AssemblyAI after starting transcription
    transcriptId: { type: Schema.Types.ObjectId, ref: "Transcript" }, // after saving final transcript
  },
  { timestamps: true }
);

const TranscriptJob = models?.TranscriptJob || model("TranscriptJob", transcriptJobSchema);
export default TranscriptJob;
