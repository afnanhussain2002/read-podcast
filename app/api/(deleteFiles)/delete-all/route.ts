import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transcript from "@/models/Transcript";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) { 

    const {userId} = await req.json();
   
   const session = await getServerSession(authOptions);

//    const userId = session?.user?.id;
   console.log(userId);
   
      if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

      try {
        await connectToDatabase();

        const result = await Transcript.deleteMany({ ownerId: userId });

        if (result.deletedCount === 0) {
          return NextResponse.json({ error: "No transcriptions found" }, { status: 404 });
        }

        return NextResponse.json({ message: "All transcriptions deleted successfully" }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: "Failed to delete transcriptions" }, { status: 500 });
      }  
}