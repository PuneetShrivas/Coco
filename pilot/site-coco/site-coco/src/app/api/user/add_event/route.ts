import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME
} = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY ?? '',
  }
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, image, date, eventName, people } = data;

    // Validate the input
    if (!userId || !image || !date || !eventName || !people) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Convert date string to Date object
    const eventDate = new Date(date);

    // Check if there's an existing event on the same date
    const existingEvent = await prisma.event.findFirst({
      where: {
        userId,
        AND: {
          date: {
            gte: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 0, 0, 0),
            lt: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate() + 1, 0, 0, 0),
          }
        }
      }
    });

    // If there's an existing event, delete it
    if (existingEvent) {
      await prisma.event.delete({
        where: {
          id: existingEvent.id
        }
      });

      
    }

    // Save the image to S3
    const imageKey = `${uuidv4()}.jpeg`;
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: imageKey,
      Body: Buffer.from(image, 'base64'),
      ContentType: 'image/jpeg',
      ACL: "public-read",
    });
    await s3Client.send(putCommand);

    // Create the event and associated image record in the database
    const newEvent = await prisma.event.create({
      data: {
        userId,
        date: eventDate,
        name: eventName,
        people,
        images: {
          create: {
            url: `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${imageKey}`,
            thumbnail: `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${imageKey}`, // Assuming thumbnail is same as image for simplicity
          }
        }
      }
    });

    return new NextResponse(JSON.stringify(newEvent), { status: 201 });
  } catch (error) {
    console.error('Error saving event:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to save event' }), { status: 500 });
  }
}
