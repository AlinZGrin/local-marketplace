const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Checking database...')
    
    // Count total listings
    const totalListings = await prisma.listing.count()
    console.log(`📊 Total listings in database: ${totalListings}`)
    
    // Count ACTIVE listings
    const activeListings = await prisma.listing.count({
      where: { status: 'ACTIVE' }
    })
    console.log(`✅ Active listings: ${activeListings}`)
    
    // Get sample listings
    const sampleListings = await prisma.listing.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        isActive: true,
        createdAt: true
      }
    })
    console.log('📝 Sample listings:')
    console.log(sampleListings)
    
    // Check users count
    const totalUsers = await prisma.user.count()
    console.log(`👥 Total users: ${totalUsers}`)
    
    // Check categories count
    const totalCategories = await prisma.category.count()
    console.log(`📂 Total categories: ${totalCategories}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()