// /app/api/chat-session/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionId = params.id;
    
  try {
    const chatSession = await prisma.userChatSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' }, // Order to get the latest message first
        },
      },
    });

    if (!chatSession) {
      return new NextResponse(JSON.stringify({ error: 'Chat session not found' }), { status: 404 });
    }

    const formattedSession = {
      ...chatSession,
      date: chatSession.messages[0]?.timestamp.toISOString(), // Get timestamp from the latest message
    };
    return NextResponse.json(formattedSession);
  } catch (error) {
    console.error("Error fetching chat session:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch chat session' }), { status: 500 });
  }
}
