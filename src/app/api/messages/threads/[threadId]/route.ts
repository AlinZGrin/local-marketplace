import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/messages/threads/[threadId] - Get specific thread with messages
export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const thread = await prisma.messageThread.findFirst({
      where: {
        id: params.threadId,
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      )
    }

    // Transform the data to match frontend interface
    const transformedThread = {
      id: thread.id,
      buyerId: thread.buyerId,
      sellerId: thread.sellerId,
      listingId: thread.listingId,
      messages: thread.messages.map((message: any) => ({
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        type: message.type,
        isRead: message.isRead,
        createdAt: message.createdAt.toISOString(),
        sender: message.sender
      }))
    }

    return NextResponse.json({
      thread: transformedThread
    })
  } catch (error) {
    console.error('Error fetching thread:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread' },
      { status: 500 }
    )
  }
}