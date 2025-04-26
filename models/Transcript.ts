import { ITranscript } from "@/dataTypes/transcribeDataTypes";
import { Schema, model, models } from "mongoose";

// Define the speaker schema
const SpeakerSchema = new Schema({
  speaker: String,
  text: String,
  start: Number,
  end: Number
});

const ChaptersSchema = new Schema({
  gist: String,
  headline: String,
  start: Number,
  end: Number
})

/* const ParagraphsSchema = new Schema({
  text: String,
  start: Number,
  end: Number
}) */

const transcriptSchema = new Schema<ITranscript>(
  {
    transcript: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 1,required: true },
    speakers: [SpeakerSchema],
    chapters: [ChaptersSchema],
    summary: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User"},
    
  },
  { timestamps: true }
);

const Transcript = models?.Transcript || model<ITranscript>("Transcript", transcriptSchema);

export default Transcript;
