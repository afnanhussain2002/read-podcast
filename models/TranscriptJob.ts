// models/TranscriptionJob.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITranscriptionJob extends Document {
  userId: mongoose.Types.ObjectId;
  videoUrl: string;
  speakers: boolean;
  status: 'pending' | 'processing' | 'transcribing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  error?: string;
  audioUrl?: string;
  transcriptId?: mongoose.Types.ObjectId;
}

const TranscriptionJobSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true },
    speakers: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'processing', 'transcribing', 'completed', 'failed'], default: 'pending' },
    error: { type: String },
    audioUrl: { type: String },
    transcriptId: { type: Schema.Types.ObjectId, ref: 'Transcript' },
  },
  { timestamps: true }
);

export default mongoose.models.TranscriptionJob || mongoose.model<ITranscriptionJob>('TranscriptionJob', TranscriptionJobSchema);
