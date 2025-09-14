import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🧪 Debug endpoint called')
    
    // Test basic database connection
    const totalListings = await prisma.listing.count()
    console.log(`📊 Total listings: ${totalListings}`)
    
    const activeListings = await prisma.listing.count({
      where: { status: 'ACTIVE' }
    })
    console.log(`✅ Active listings: ${activeListings}`)
    
    // Get first listing
    const firstListing = await prisma.listing.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
          }
        },
        category: true
      }
    })
    
    return NextResponse.json({
      success: true,
      totalListings,
      activeListings,
      firstListing: firstListing ? {
        id: firstListing.id,
        title: firstListing.title,
        price: firstListing.price,
        address: firstListing.address,
        user: firstListing.user,
        category: firstListing.category
      } : null
    })
  } catch (error) {
    console.error('❌ Debug endpoint error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}