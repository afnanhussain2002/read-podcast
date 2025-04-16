import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    try {
        const userEmail = session.user.email;

        const transcriptions = await Transcript.find({ user: userEmail });

        if (!transcriptions) {
            return NextResponse.json({ error: "No transcriptions found" }, { status: 404 });
        }

        return NextResponse.json({ transcriptions }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong on get transcriptions' }, { status: 500 });
    }
}