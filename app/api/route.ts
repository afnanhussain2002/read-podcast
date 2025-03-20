import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {audio} = await request.json()

    if (!audio) {
        return NextResponse.json(
            { error: "Audio is required" },
            { status: 400 }
        )
    }
}