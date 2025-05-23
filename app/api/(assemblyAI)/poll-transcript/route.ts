// /app/api/poll-transcript/route.ts

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const transcriptId = req.nextUrl.searchParams.get("transcriptId");

  if (!transcriptId) {
    return NextResponse.json({ error: "Missing transcriptId" }, { status: 400 });
  }

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  const endpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
  const headers = {
    authorization: apiKey,
    "content-type": "application/json",
  };

  try {
    // Poll every 3 seconds, up to 10 times (30 seconds max)
    for (let i = 0; i < 10; i++) {
      const response = await axios.get(endpoint, { headers }); // ❗️Use GET here
      const data = response.data;

      if (data.status === "completed") {
        return NextResponse.json({ success: true, status: "completed", transcriptId });
      } else if (data.status === "error") {
        return NextResponse.json({ error: data.error, status: "error" });
      }

      // Wait 3 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return NextResponse.json({ status: "processing", success: false });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Polling failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
