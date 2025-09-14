import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/messages/threads/[threadId]/messages - Send a new message to thread
export async function POST(
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

    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Verify user is participant in thread
    const thread = await prisma.messageThread.findFirst({
      where: {
        id: params.threadId,
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
      }
    })

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found or access denied' },
        { status: 404 }
      )
    }

    // Create new message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: session.user.id,
        threadId: params.threadId
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
    })

    // Update thread's lastMessageAt timestamp
    await prisma.messageThread.update({
      where: {
        id: params.threadId
      },
      data: {
        lastMessageAt: new Date()
      }
    })

    // Transform the response
    const transformedMessage = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender
    }

    return NextResponse.json({
      message: transformedMessage
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}