import { client } from "@/lib/assemblyApi";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { audioUrl } = await req.json();

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
      const message =
            error instanceof Error ? error.message : "Something went wrong while getting summary";
      
          return NextResponse.json({ error: message }, { status: 500 });
    }


    
}