import mongoose from "mongoose";


// Define the speaker type for each utterance
export interface ISpeaker {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

// Main transcript interface without audioUrl, status, and words
export interface ITranscript {
    _id?: mongoose.Types.ObjectId;
    transcript: string;
    confidence?: number;   
    speakers?: ISpeaker[]; 
    createdAt?: Date;
    updatedAt?: Date;
  }