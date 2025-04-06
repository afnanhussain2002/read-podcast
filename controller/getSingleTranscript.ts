import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export default async function getSingleTranscript(transcriptId: string) {
    try {
        await connectToDatabase();
    } catch (error) {
        NextResponse.json({ error: "Failed to get the transcript" }, { status: 500 });
    }
}