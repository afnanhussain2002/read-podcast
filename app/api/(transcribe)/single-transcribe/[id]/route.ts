import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const id = params.id;

  try {
    await connectToDatabase();
    const transcript = await Transcript.findById(id);

    if (!transcript) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    return NextResponse.json({ transcript }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error as string}, 
      { status: 500 }
    );
  }
}