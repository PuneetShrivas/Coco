// app/api/user/onboarded/route.ts

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

  const { isOnboarded } = await request.json(); // Get isOnboarded from request body

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnboarded },  // Use the provided isOnboarded value
    });

    return NextResponse.json({ message: "User onboarding status updated successfully" });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update onboarding status' }), { status: 500 });
  }
}
