import { client } from "@/lib/assemblyApi";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { audioUrl } = await req.json();

    console.log(audioUrl);

    try {
        await connectToDatabase();

        const getEntities = await client.transcripts.transcribe({
            audio: audioUrl,
            entity_detection: true,
        })

        console.log("getEntities",getEntities);

        if (!getEntities.entities) {
            return NextResponse.json({ error: "Something went wrong when getting entities" }, { status: 501 });
        }

        const updateEntities = await Transcript.findOneAndUpdate(
            { audioUrl },
            { entities: getEntities.entities },
            { new: true }
        )

        if (!updateEntities) {
         return NextResponse.json({ error: "Transcript not found" }, { status: 404 });   
        }

        return NextResponse.json({ entities: updateEntities.entities }, { status: 200 });
    } catch (error) {
         const message =
      error instanceof Error ? error.message : "Something went wrong while getting entities";

    return NextResponse.json({ error: message }, { status: 500 });
    }


    
}