import { s3 } from "@/lib/assemblyApi";
import { authOptions } from "@/lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { fileName, fileType } = await req.json();

  if (!fileName || !fileType) {
    return NextResponse.json({ error: "Missing fileName or fileType" });
  }

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `vidonotes/${fileName}`,
    ContentType: 'audio/mpeg',
  });

  const signedUrl = await getSignedUrl(s3, command); // 1 min

  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/vidonotes/${fileName}`;

  return NextResponse.json({ uploadUrl: signedUrl, fileUrl });
}
