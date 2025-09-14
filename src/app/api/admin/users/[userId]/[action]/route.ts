import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; action: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, action } = params

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case 'suspend':
        updateData = { isSuspended: true }
        break
      case 'unsuspend':
        updateData = { isSuspended: false }
        break
      case 'promote':
        updateData = { isAdmin: true }
        break
      case 'demote':
        updateData = { isAdmin: false }
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isSuspended: true,
        isAdmin: true
      }
    })

    let actionType: string;
    switch (action) {
      case 'suspend':
        actionType = 'SUSPEND_USER';
        break;
      case 'unsuspend':
        actionType = 'UNSUSPEND_USER';
        break;
      case 'promote':
        actionType = 'SEND_WARNING'; // No promote type in enum, using warning
        break;
      case 'demote':
        actionType = 'SEND_WARNING'; // No demote type in enum, using warning
        break;
      default:
        actionType = 'SEND_WARNING';
    }

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        type: actionType,
        userId: userId,
        reason: `Admin ${action} action`
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}