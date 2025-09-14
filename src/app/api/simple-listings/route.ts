import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Simple listings API test...')
    
    // Very basic query without any includes
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        condition: true,
        address: true,
        images: true,
        createdAt: true,
        userId: true,
        categoryId: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`✅ Found ${listings.length} listings`)
    
    return NextResponse.json({
      success: true,
      count: listings.length,
      listings: listings.map((listing: any) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        condition: listing.condition,
        locationAddr: listing.address,
        images: listing.images || [],
        createdAt: listing.createdAt,
        user: { id: listing.userId, name: 'Demo User' }, // Hardcoded for testing
        category: { id: listing.categoryId, name: 'Demo Category' } // Hardcoded for testing
      }))
    })
    
  } catch (error) {
    console.error('❌ Simple listings error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}