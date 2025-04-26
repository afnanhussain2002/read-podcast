import mongoose from "mongoose";


// Define the speaker type for each utterance
export interface ISpeaker {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface chapters{
  gist?: string;
  headline?: string;
  start?: number;
  end?: number;
}
export type entity = {
  entity_type?: string;
  text?: string;
  start?: number;
  end?: number;
};

/* export interface paragraphs{
  text: string;
  start: number;
  end: number;
} */

// Main transcript interface without audioUrl, status, and words
export interface ITranscript {
    _id?: mongoose.Types.ObjectId;
    audioUrl: string;
    transcript: string;
    confidence: number;   
    speakers?: ISpeaker[]; 
    createdAt?: Date;
    updatedAt?: Date;
    chapters?: chapters[] | undefined;
    entities?:entity[];
    summary?: string | null;
    ownerId?: mongoose.Types.ObjectId;
  }