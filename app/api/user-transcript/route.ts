import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
}