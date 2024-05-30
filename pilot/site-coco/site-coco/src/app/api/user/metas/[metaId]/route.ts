import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { metaId: string } }) {
  const { metaId } = params;

  try {
    const meta = await prisma.user_Meta.findUnique({
      where: { id: metaId },
    });
    if (meta) {
      return NextResponse.json(meta);
    } else {
      return new NextResponse(JSON.stringify({ error: 'Meta not found' }), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user meta:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch user meta' }), { status: 500 });
  }
}

