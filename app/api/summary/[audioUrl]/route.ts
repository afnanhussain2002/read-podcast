import { connectToDatabase } from "@/lib/db";

export async function POST({ params }: { params: { audioUrl: string } }) {
    const { audioUrl } = await params;

    try {
        await connectToDatabase();
    } catch (error) {
        
    }


    
}