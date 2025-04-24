import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
    const { password, email } = await req.json();

    try {
        await connectToDatabase();
    } catch (error) {
        
    }

    

  
}