import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting comprehensive database diagnostic...')
    
    // Test 1: Basic connection
    console.log('📡 Testing basic database connection...')
    const dbHealth = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful:', dbHealth)

    // Test 2: Check if tables exist
    console.log('📋 Checking table structure...')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📊 Tables found:', tables)

    // Test 3: Count all listings without filters
    console.log('🔢 Counting all listings...')
    const totalListings = await prisma.listing.count()
    console.log(`📊 Total listings in database: ${totalListings}`)

    // Test 4: Get a few listings with minimal data
    console.log('📝 Fetching sample listings...')
    const sampleListings = await prisma.listing.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      }
    })
    console.log('📋 Sample listings:', sampleListings)

    // Test 5: Check if there are ACTIVE listings
    console.log('🟢 Checking ACTIVE listings...')
    const activeListings = await prisma.listing.count({
      where: { status: 'ACTIVE' }
    })
    console.log(`✅ Active listings: ${activeListings}`)

    // Test 6: Check listing statuses
    console.log('📊 Checking all listing statuses...')
    const statusCounts = await prisma.listing.groupBy({
      by: ['status'],
      _count: true
    })
    console.log('📈 Status distribution:', statusCounts)

    return NextResponse.json({
      success: true,
      diagnostics: {
        connectionTest: dbHealth,
        tables: tables,
        totalListings,
        activeListings,
        statusCounts,
        sampleListings: sampleListings.map((l: any) => ({
          id: l.id,
          title: l.title,
          status: l.status
        }))
      }
    })
    
  } catch (error) {
    console.error('❌ Diagnostic error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  }
}