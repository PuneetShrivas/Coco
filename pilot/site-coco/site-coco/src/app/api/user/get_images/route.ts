import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch the most recent events (up to 6)
    const recentEvents = await prisma.event.findMany({
      take: 6, // Limit to 6 events
      orderBy: { date: 'desc' }, // Order by date descending (most recent first)
      select: {
        images: { // Select the images field from each event
          select: {
            url: true, // Select the URL of the image
          }
        }
      }
    });

    // Extract the image URLs from the recent events
    const imageUrls = recentEvents.map(event => event.images[0]?.url).filter(url => !!url);

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error('Error fetching recent images:', error);
    return NextResponse.json({ error: 'Failed to fetch recent images' }, { status: 500 });
  }
}
