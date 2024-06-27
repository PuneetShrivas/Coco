import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { chat_session_id, chat_history, query } = await request.json();

    if (!chat_history || !query || !chat_session_id) {
        return new NextResponse(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }

    try {
        let chatSession = null;

        // Find or create the chat session based on provided chat_session_id
        if (chat_session_id) {
            chatSession = await prisma.userChatSession.findUnique({
                where: { id: chat_session_id },
            });
        }

        if (!chatSession) {
            // Create new chat session if not found
            chatSession = await prisma.userChatSession.create({
                data: {
                    id: chat_session_id,
                    user: { connect: { id: user.id } },
                    messages: {
                        create: [],
                    },
                },
            });
        }

        // Replace existing messages with new chat history
        await prisma.chatMessage.deleteMany({
            where: { sessionId: chatSession.id },
        });

        const chatMessages = chat_history.map((item: any) => ({
            sessionId: chatSession!.id,
            sender: item.role,
            content: item.content,
            productQuestions: item.questionsAndProducts 
            ? JSON.stringify(item.questionsAndProducts) // Serialize if present
            : null,
        }));

        await prisma.chatMessage.createMany({
            data: chatMessages,
        });

        // Optionally update session updatedAt timestamp
        await prisma.userChatSession.update({
            where: { id: chatSession!.id },
            data: { /* No need to update any additional fields if not required */ },
        });

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error saving chat session:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to save chat session" }), { status: 500 });
    }
}
