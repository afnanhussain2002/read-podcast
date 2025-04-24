import { connectToDatabase } from "@/lib/db"

export async function POST(req: Request) {
    const {email} = await req.json()
    await connectToDatabase()
}