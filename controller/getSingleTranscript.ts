import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextResponse } from "next/server";

export default async function getSingleTranscript(transcriptId: string) {
    try {
        await connectToDatabase();

        const transcript = await Transcript.findById(transcriptId);

        if (!transcript) {
            return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
        }

        return NextResponse.json({ transcript }, { status: 200 });
    } catch (error) {
        console.log(error, "error from getting transcript");
        NextResponse.json({ error: "Failed to get the transcript" }, { status: 500 });
    }
}