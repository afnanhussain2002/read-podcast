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


  const EntitiesSchema = new Schema({
    entity_type: String,
    text: String,
    start: Number,
    end: Number
  }, {id: false});

const transcriptSchema = new Schema<ITranscript>(
  {
    transcriptId: { type: String, },
    audioUrl: { type: String, required: true },
    transcript: { type: String, required: false, default: "" },
    confidence: { type: Number, default: 0 },
    speakers: { type: [SpeakerSchema], default: [] },
    chapters: { type: [ChaptersSchema], default: [] },
    entities: { type: [EntitiesSchema], default: [] },
    summary: { type: String, default: null },
    processing : { type: Boolean, },
    ownerId: { type: Schema.Types.ObjectId, ref: "User"},
    
  },
  { timestamps: true }
);

const Transcript = models?.Transcript || model<ITranscript>("Transcript", transcriptSchema);

export default Transcript;
