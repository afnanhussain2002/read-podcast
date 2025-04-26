import { client } from "@/lib/assemblyApi";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { audioUrl } = await req.json();

    try {
        await connectToDatabase();

        const getChapters = await client.transcripts.transcribe({
            audio: audioUrl,
           auto_chapters: true,
        })

        if (!getChapters.chapters) {
            return NextResponse.json({ error: "Something went wrong when getting chapters" }, { status: 501 });
        }

        const updateChapters = await Transcript.findOneAndUpdate(
            { audioUrl },
            { chapters: getChapters.chapters },
            { new: true }
        )

        if (!updateChapters) {
         return NextResponse.json({ error: "Transcript not found" }, { status: 404 });   
        }

        return NextResponse.json({ chapters: updateChapters.chapters }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error as string }, { status: 500 });
    }


    
}