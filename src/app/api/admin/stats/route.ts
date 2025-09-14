import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current date and 30 days ago for monthly growth calculation
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Get total counts
    const [
      totalUsers,
      totalListings,
      totalMessages,
      totalReports,
      activeListings,
      pendingReports,
      usersLastMonth,
      usersMonthBefore,
      listingsLastMonth,
      listingsMonthBefore
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.message.count(),
      prisma.report.count(),
      prisma.listing.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.report.count({
        where: { status: 'PENDING' }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.listing.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      prisma.listing.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      })
    ])

    // Calculate growth percentages
    const userGrowth = usersMonthBefore > 0 
      ? Math.round(((usersLastMonth - usersMonthBefore) / usersMonthBefore) * 100)
      : 100

    const listingGrowth = listingsMonthBefore > 0 
      ? Math.round(((listingsLastMonth - listingsMonthBefore) / listingsMonthBefore) * 100)
      : 100

    const stats = {
      totalUsers,
      totalListings,
      totalMessages,
      totalReports,
      activeListings,
      pendingReports,
      monthlyGrowth: {
        users: userGrowth,
        listings: listingGrowth
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}