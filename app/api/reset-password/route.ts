import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
    const { password, email } = await req.json();

    await connectToDatabase();
  
}