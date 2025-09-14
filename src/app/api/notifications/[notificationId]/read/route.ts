import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId } = params

    if (!notificationId) {
      return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 })
    }

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id // Ensure user can only mark their own notifications
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}