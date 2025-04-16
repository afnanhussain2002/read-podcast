import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    try {
        const userId = session.user.id;

        const transcriptions = await Transcript.find({ OwnerId: userId });

        if (!transcriptions) {
            return NextResponse.json({ error: "No transcriptions found" }, { status: 404 });
        }

        return NextResponse.json({ transcriptions }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to get user transcriptions"  }, { status: 500 });
    }
}