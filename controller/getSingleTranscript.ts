import { connectToDatabase } from "@/lib/db";

export default async function getSingleTranscript(transcriptId: string) {
    try {
        await connectToDatabase();
    } catch (error) {
        
    }
}