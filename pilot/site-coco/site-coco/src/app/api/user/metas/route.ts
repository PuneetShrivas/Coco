// app/api/user/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const formData = await request.json();

  try {
    // Fetch existing user preferences
    let existingMetas = await prisma.user_Meta.findUnique({
      where: { id: user.id }, // Use the implicit 'userId' field
    });

    if (existingMetas) {
      // Update existing Metaerences
      existingMetas = await prisma.user_Meta.update({
        where: { id: existingMetas.id },
        data: formData,
      });
    } else {
      // Create new Metaerences
      existingMetas = await prisma.user_Meta.create({
        data: {
          ...formData,
          user: { connect: { id: user.id } }, // Associate with the user
        },
      });
    }

    return NextResponse.json(existingMetas);
  } catch (error) {
    console.error("Error saving metadatas:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to save metadatas' }), { status: 500 });
  }
}
