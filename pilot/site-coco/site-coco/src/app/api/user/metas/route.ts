import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { v4 as uuidv4 } from 'uuid'; 

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await request.json();

  try {
    const existingMetas = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        meta: true, // Include the User_Meta relation
      },
    });

    if (existingMetas && existingMetas.meta) {
      // User_Meta already exists, update it
      const updatedMetas = await prisma.user_Meta.update({
        where: { id: existingMetas.meta.id },
        data: formData,
      });

      return NextResponse.json(updatedMetas);
    } else {
      // User_Meta doesn't exist, create it
      const newMetas = await prisma.user_Meta.create({
        data: {
          id: uuidv4(),
          ...formData,
          user: { connect: { id: user.id } },
        },
      });

      return NextResponse.json(newMetas);
    }
  } catch (error) {
    console.error("Error saving metadatas:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to save metadatas" }), { status: 500 });
  }
}
