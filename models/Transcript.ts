import { ITranscript } from "@/dataTypes/transcribeDataTypes";
import { Schema, model, models } from "mongoose";

// Define the speaker schema
const SpeakerSchema = new Schema({
  speaker: String,
  text: String,
  start: Number,
  end: Number
}, {id: false});

const ChaptersSchema = new Schema({
  gist: String,
  headline: String,
  start: Number,
  end: Number
}, {id: false});

/* const ParagraphsSchema = new Schema({
  text: String,
  start: Number,
  end: Number
}) */

  const EntitiesSchema = new Schema({
    entity_type: String,
    text: String,
    start: Number,
    end: Number
  }, {id: false});

const transcriptSchema = new Schema<ITranscript>(
  {
    audioUrl: { type: String, required: true },
    transcript: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 1,required: true },
    speakers: [SpeakerSchema],
    chapters: { type: [ChaptersSchema], default: [] },
    entities: { type: [EntitiesSchema], default: [] },
    summary: { type: String, default: null },
    ownerId: { type: Schema.Types.ObjectId, ref: "User"},
    
  },
  { timestamps: true }
);

const Transcript = models?.Transcript || model<ITranscript>("Transcript", transcriptSchema);

export default Transcript;
