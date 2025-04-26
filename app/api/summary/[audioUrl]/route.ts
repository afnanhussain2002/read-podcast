import { client } from "@/lib/assemblyApi";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextResponse } from "next/server";

export async function POST({ params }: { params: { audioUrl: string } }) {
    const { audioUrl } = await params;

    try {
        await connectToDatabase();

        const getSummary = await client.transcripts.transcribe({
            audio: audioUrl,
            summarization: true,
            summary_model: "informative",
            summary_type: "bullets",
        })

        if (!getSummary.summary) {
            return NextResponse.json({ error: "Something went wrong when getting summary" }, { status: 404 });
        }

        const updateSummary = await Transcript.findOneAndUpdate(
            { audioUrl },
            { summary: getSummary.summary },
            { new: true }
        )

        if (!updateSummary) {
         return NextResponse.json({ error: "Transcript not found" }, { status: 404 });   
        }

        return NextResponse.json({ summary: updateSummary.summary }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error as string }, { status: 500 });
    }


    
}