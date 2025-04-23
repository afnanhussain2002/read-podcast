import { NextRequest } from "next/server";

export default async function POST(req: NextRequest) {
    const {email} = await req.json();
}