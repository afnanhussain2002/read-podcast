import { ISpeaker } from "@/dataTypes/transcribeDataTypes";
import { connectToDatabase } from "@/lib/db";


export default async function saveTranscript(transcript: string, confidence: number, speakers: ISpeaker[], OwnerId: string) {
     try {
        connectToDatabase();
     } catch (error) {
        
     }
}