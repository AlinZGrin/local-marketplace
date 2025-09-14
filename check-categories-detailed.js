const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany();
    console.log('📋 Categories in database:');
    categories.forEach(cat => {
      console.log(`  - ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}`);
    });
    
    console.log('\n📦 Electronics listings:');
    const electronicsListings = await prisma.listing.findMany({
      where: { category: { slug: 'electronics' } },
      include: { category: true }
    });
    console.log(`Found ${electronicsListings.length} electronics listings`);
    electronicsListings.forEach(listing => {
      console.log(`  - ${listing.title} (Category ID: ${listing.categoryId})`);
    });

    console.log('\n🔍 Test direct category ID filter:');
    const electronicsCategory = categories.find(cat => cat.slug === 'electronics');
    if (electronicsCategory) {
      const listingsByCategoryId = await prisma.listing.findMany({
        where: { categoryId: electronicsCategory.id },
        include: { category: true }
      });
      console.log(`Found ${listingsByCategoryId.length} listings with categoryId = ${electronicsCategory.id}`);
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkCategories();