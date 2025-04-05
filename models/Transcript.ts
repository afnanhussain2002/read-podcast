import { ITranscript } from "@/dataTypes/transcribeDataTypes";
import mongoose, { Schema, model, models } from "mongoose";



const transcriptSchema = new Schema<ITranscript>(
  {
    audioUrl: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["queued", "processing", "completed", "failed"], 
      required: true 
    },
    text: { type: String },
    words: [
      {
        start: { type: Number, required: true },
        end: { type: Number, required: true },
        text: { type: String, required: true },
        confidence: { type: Number, required: true },
      },
    ],
    confidence: { type: Number, min: 0, max: 1 },
    processingCompletedAt: { type: Date },
  },
  { timestamps: true }
);

const Transcript = models?.Transcript || model<ITranscript>("Transcript", transcriptSchema);

export default Transcript;
