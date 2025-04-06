import { ISpeaker } from "@/dataTypes/transcribeDataTypes";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";


export default async function saveTranscript(transcript: string, confidence: number, speakers: ISpeaker[], OwnerId: string) {
     try {
        connectToDatabase();

        const transcribedData = await Transcript.create({transcript, confidence, speakers, OwnerId});
     } catch (error) {
        
     }
}