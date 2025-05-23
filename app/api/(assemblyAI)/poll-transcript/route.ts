import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const transcriptId = req.nextUrl.searchParams.get("transcriptId");

  if (!transcriptId) {
    return NextResponse.json({ error: "Missing transcriptId" }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY!,
        "content-type": "application/json",
      },
    });

    return NextResponse.json({ success: true, status: response.data.status, transcriptId });
  } catch (error) {
   const message =
      error instanceof Error ? error.message : "Polling failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
