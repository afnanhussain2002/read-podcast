import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) { 
   const session = await getServerSession(authOptions);

   const userId = session?.user?.id;
   
      if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

      try {
        await connectToDatabase();
      } catch (error) {
        
      }  
}