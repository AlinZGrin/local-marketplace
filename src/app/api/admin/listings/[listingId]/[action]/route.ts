import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { listingId: string; action: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listingId, action } = params

    if (!listingId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    let result: any

    switch (action) {
      case 'delete':
        result = await prisma.listing.update({
          where: { id: listingId },
          data: { status: 'INACTIVE' }
        })
        break
      case 'feature':
        result = await prisma.listing.update({
          where: { id: listingId },
          data: { isFeatured: true }
        })
        break
      case 'unfeature':
        result = await prisma.listing.update({
          where: { id: listingId },
          data: { isFeatured: false }
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    let actionType: string;
    switch (action) {
      case 'delete':
        actionType = 'DELETE_LISTING';
        break;
      case 'feature':
        actionType = 'FEATURE_LISTING';
        break;
      case 'unfeature':
        actionType = 'UNFEATURE_LISTING';
        break;
      default:
        actionType = 'DELETE_LISTING';
    }

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        type: actionType,
        listingId: listingId,
        reason: `Admin ${action} action`
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}