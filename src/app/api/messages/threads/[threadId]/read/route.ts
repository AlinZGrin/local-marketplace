import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/messages/threads/[threadId]/read - Mark messages as read
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

    // Mark all unread messages from other users as read
    await prisma.message.updateMany({
      where: {
        threadId: params.threadId,
        senderId: {
          not: session.user.id
        },
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}