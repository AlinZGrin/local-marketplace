import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const offerSchema = z.object({
  listingId: z.string(),
  amount: z.number().min(0.01, 'Offer amount must be greater than 0'),
  message: z.string().optional(),
})

// GET /api/offers - Get user's offers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'made' // 'made' or 'received'

    const offers = await prisma.offer.findMany({
      where: type === 'made' 
        ? { buyerId: session.user.id }
        : { listing: { userId: session.user.id } },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

// POST /api/offers - Create a new offer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = offerSchema.parse(body)

    // Check if listing exists and is active
    const listing = await prisma.listing.findUnique({
      where: { id: validatedData.listingId },
      select: { 
        id: true, 
        userId: true, 
        status: true, 
        price: true,
        title: true,
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Listing is not active' },
        { status: 400 }
      )
    }

    if (listing.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot make offer on your own listing' },
        { status: 400 }
      )
    }

    // Check for existing pending offer from this buyer
    const existingOffer = await prisma.offer.findFirst({
      where: {
        listingId: validatedData.listingId,
        buyerId: session.user.id,
        status: 'PENDING',
      },
    })

    if (existingOffer) {
      return NextResponse.json(
        { error: 'You already have a pending offer on this listing' },
        { status: 400 }
      )
    }

    const offer = await prisma.offer.create({
      data: {
        ...validatedData,
        buyerId: session.user.id,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            userId: true,
          },
        },
      },
    })

    // Create notification for seller
    await prisma.notification.create({
      data: {
        userId: listing.userId,
        type: 'NEW_OFFER',
        title: 'New Offer Received',
        content: `You received a $${validatedData.amount} offer on "${listing.title}"`,
        listingId: validatedData.listingId,
        metadata: { offerId: offer.id },
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}