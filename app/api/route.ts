import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const {video} = await request.json()

    if (!video) {
        return NextResponse.json(
            { error: "Audio is required" },
            { status: 400 }
        )
    }


}