import { connectToDatabase } from "@/lib/db"
import crypto from "crypto"

export async function POST(req: Request) {
    const {email} = await req.json()
    await connectToDatabase()
}