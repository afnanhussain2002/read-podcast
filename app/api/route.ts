import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const {audio} = await request.json()
}