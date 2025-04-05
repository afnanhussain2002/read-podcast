import { ITranscript } from "@/dataTypes/transcribeDataTypes";
import mongoose, { Schema, model, models } from "mongoose";

// Define the speaker schema
const SpeakerSchema = new Schema({
  speaker: String,
  text: String,
  start: Number,
  end: Number
});

const transcriptSchema = new Schema<ITranscript>(
  {
    transcript: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 1 },
    speakers: [SpeakerSchema],
    OwnerId: { type: Schema.Types.ObjectId, ref: "User" },
    
  },
  { timestamps: true }
);

const Transcript = models?.Transcript || model<ITranscript>("Transcript", transcriptSchema);

export default Transcript;
