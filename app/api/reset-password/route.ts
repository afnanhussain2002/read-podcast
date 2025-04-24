import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
    const { password, email } = await req.json();

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        
    } catch (error) {
        
    }

    

  
}