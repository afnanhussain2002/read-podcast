import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextResponse } from "next/server";

export default async function getSingleTranscript(transcriptId: string) {
    try {
        await connectToDatabase();

        const transcript = await Transcript.findById(transcriptId);
    } catch (error) {
        NextResponse.json({ error: "Failed to get the transcript" }, { status: 500 });
    }
}