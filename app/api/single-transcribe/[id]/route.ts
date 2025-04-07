import getSingleTranscript from "@/controller/getSingleTranscript";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    const singleTranscript = await getSingleTranscript(id);
    if (!singleTranscript) {
        return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    return NextResponse.json({ singleTranscript }, { status: 200 });
}