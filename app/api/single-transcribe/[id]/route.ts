import getSingleTranscript from "@/controller/getSingleTranscript";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    const transcript = await getSingleTranscript(id);
    if (!transcript) {
        return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    return NextResponse.json({ transcript }, { status: 200 });
}