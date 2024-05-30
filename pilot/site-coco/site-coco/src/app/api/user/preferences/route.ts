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
    let existingPrefs = await prisma.user_Pref.findUnique({
      where: { id: user.id }, // Use the implicit 'userId' field
    });

    if (existingPrefs) {
      // Update existing preferences
      existingPrefs = await prisma.user_Pref.update({
        where: { id: existingPrefs.id },
        data: formData,
      });
    } else {
      // Create new preferences
      existingPrefs = await prisma.user_Pref.create({
        data: {
          ...formData,
          user: { connect: { id: user.id } }, // Associate with the user
        },
      });
    }

    return NextResponse.json(existingPrefs);
  } catch (error) {
    console.error("Error saving preferences:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to save preferences' }), { status: 500 });
  }
}
