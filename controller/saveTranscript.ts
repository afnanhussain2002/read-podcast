import { ISpeaker } from "@/dataTypes/transcribeDataTypes";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextResponse } from "next/server";


export default async function saveTranscript(transcript: string, confidence: number, speakers: ISpeaker[] | undefined, OwnerId: string) {
     try {
      await connectToDatabase();

        const transcribedData = await Transcript.create({transcript, confidence, speakers, OwnerId});

        const createdTranscript = await Transcript.findById(transcribedData._id);

        if (!createdTranscript) {
         NextResponse.json({error: "Failed to save data on database"}, {status: 500});
        }

        console.log(transcribedData, "Save on database");

        return NextResponse.json({createdTranscript,}, {status: 200});

     } catch (error) {
        console.log(error, "error from saving data on database");
        NextResponse.json({error: "Failed to save data on database"}, {status: 500});
     }
}