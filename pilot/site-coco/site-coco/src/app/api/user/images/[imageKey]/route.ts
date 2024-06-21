import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    S3_BUCKET_NAME
  } = process.env

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID??'',
        secretAccessKey: AWS_SECRET_ACCESS_KEY??'',
    }
  });

export async function GET(request: NextRequest, { params }: { params: { imageKey: string } }) {
    const { imageKey } = params;
    console.log(imageKey)
    try {
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME, // Replace with your S3 bucket name
        Key: imageKey,
      });
  
      const { Body, ContentType } = await s3Client.send(command);
      if (!Body) throw new Error('Image not found in S3'); // Check for null response
  
      // Convert Body (stream) to Buffer
      const buffers = [];
      for await (const chunk of Body as Readable) {
        buffers.push(chunk);
      }
      const imageBuffer = Buffer.concat(buffers);
  
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': ContentType || 'image/jpeg',
        },
      });
    } catch (error) {
      console.error('Error fetching image from S3:', error);
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch image' }), { status: 500 });
    }
  }
