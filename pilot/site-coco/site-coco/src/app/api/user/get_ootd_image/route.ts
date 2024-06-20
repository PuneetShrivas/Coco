import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const userId = searchParams.get("userId");

  if (!dateParam || !userId) {
    return new NextResponse(JSON.stringify({ error: "Missing date or userId" }), { status: 400 });
  }

  const date = new Date(dateParam);
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

  try {
    const event = await prisma.event.findFirst({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        images: true,
        name: true,
        people: true,
      },
    });

    if (event) {
      return NextResponse.json(event);
    } else {
      return new NextResponse(JSON.stringify({ error: "No event found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch event" }), { status: 500 });
  }
}
