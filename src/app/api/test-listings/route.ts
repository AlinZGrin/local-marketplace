import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Simple listings test...')
    
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        address: true,
        images: true,
        status: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${listings.length} listings`)
    
    return NextResponse.json({
      count: listings.length,
      listings: listings
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}