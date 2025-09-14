import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/messages/threads - Get user's message threads
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const threads = await prisma.messageThread.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            status: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: {
                  not: session.user.id
                },
                isRead: false
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Transform the data to match frontend interface
    const transformedThreads = threads.map((thread: any) => ({
      id: thread.id,
      listing: thread.listing,
      participants: thread.participants,
      lastMessage: thread.messages[0] ? {
        id: thread.messages[0].id,
        content: thread.messages[0].content,
        senderId: thread.messages[0].senderId,
        createdAt: thread.messages[0].createdAt.toISOString()
      } : undefined,
      unreadCount: thread._count.messages,
      updatedAt: thread.updatedAt.toISOString()
    }))

    return NextResponse.json({ threads: transformedThreads })
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    )
  }
}

// POST /api/messages/threads - Create or get existing thread
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listingId, participantId } = await request.json()

    if (!listingId || !participantId) {
      return NextResponse.json(
        { error: 'listingId and participantId are required' },
        { status: 400 }
      )
    }

    // Check if thread already exists
    const existingThread = await prisma.messageThread.findFirst({
      where: {
        listingId,
        participants: {
          every: {
            id: {
              in: [session.user.id, participantId],
            },
          },
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            status: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (existingThread) {
      return NextResponse.json(existingThread)
    }

    // Create new thread
    const newThread = await prisma.messageThread.create({
      data: {
        listingId,
        participants: {
          connect: [
            { id: session.user.id },
            { id: participantId },
          ],
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            status: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(newThread, { status: 201 })
  } catch (error) {
    console.error('Error creating thread:', error)
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    )
  }
}