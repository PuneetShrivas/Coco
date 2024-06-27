// /app/api/user/get_chat_sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dbUserId = searchParams.get('dbUserId');
  console.log("dbUserId :", dbUserId);
  if (dbUserId) {
    try {
      const chatSessions = await prisma.user.findUnique({
        where: {
          id: dbUserId,
        },
        include: {
          chatSessions: {
            include: {
              messages: {
                where: { sender: 'assistant' }, // Only include assistant messages
                orderBy: { timestamp: 'desc' },
                take: 1,
              },
            },
          },
        },
      });

      if (!chatSessions) {
        return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
      }

      // Sort chat sessions based on latest assistant message timestamp
      chatSessions.chatSessions.sort((a, b) => {
        const timestampA = a.messages[0]?.timestamp || new Date(0); // Handle the case where there are no assistant messages
        const timestampB = b.messages[0]?.timestamp || new Date(0);
        return timestampB.getTime() - timestampA.getTime(); // Sort descending
      });

      return NextResponse.json({ chatSessions: chatSessions.chatSessions });
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch chat sessions' }), { status: 500 });
    }
  }
}
