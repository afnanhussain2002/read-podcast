import { AssemblyAI } from "assemblyai";
import { NextRequest, NextResponse } from "next/server";


const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
})


export async function POST(request: NextRequest) {
    const {video} = await request.json()

    if (!video) {
        return NextResponse.json(
            { error: "Audio is required" },
            { status: 400 }
        )
    }

   
}