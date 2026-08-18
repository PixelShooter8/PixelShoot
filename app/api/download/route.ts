import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileKey = searchParams.get('key');

  if (!fileKey) {
    return NextResponse.json({ error: 'Fail tidak dijumpai' }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    });

    // Jana pautan sementara yang sah selama 1 jam
    const signedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });

    return NextResponse.json({ url: signedUrl });
  } catch (err: any) {
    console.error('R2 Download Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}