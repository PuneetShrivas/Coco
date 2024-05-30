import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from '@prisma/client';
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
    
// Load environment variables
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME
} = process.env

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID??'',
        secretAccessKey: AWS_SECRET_ACCESS_KEY??'',
    }
  });

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication (using Kinde)
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Handle Image Upload
    const formData = await req.formData();
    const file = formData.get("image") as File; // Assuming 'image' is the field name
    const fileName = `${randomUUID()}-${file.name}` // Create a unique filename
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 3. Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read", // Optional: Make image publicly accessible
    }));

    // 4. Construct S3 Image URL
    const imageUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    // 5. Store Image in Prisma (associated with the user)
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        user: { connect: { id: user.id } },
        thumbnail: ''
        // ... (optional: add thumbnail URL if you generate one)
      },
    });

    return NextResponse.json({ 
      message: "Image uploaded successfully",
      imageUrl,
      imageId: image.id 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
