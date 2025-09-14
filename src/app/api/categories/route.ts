import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            listings: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        listingCount: category._count.listings,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      }))
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}