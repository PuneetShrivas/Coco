import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { year: number; month: number } }) {
  const { year, month } = params;
  try {
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 1);

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        date: true,
      },
    });

    const eventDates = events.map((event) => event.date.toISOString().split('T')[0]);
    return new NextResponse(JSON.stringify({ events: eventDates }), { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch user events' }), { status: 500 });
  }
}
