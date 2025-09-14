import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mock image URLs from placeholder services
const getRandomImage = (category: string, index: number) => {
  // Using multiple reliable placeholder services as fallbacks
  const imageMap: { [key: string]: string[] } = {
    phone: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop&auto=format'
    ],
    laptop: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&auto=format'
    ],
    headphones: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format'
    ],
    tablet: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop&auto=format'
    ],
    table: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop&auto=format'
    ],
    chair: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format'
    ],
    bed: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop&auto=format'
    ]
  }
  
  const categoryImages = imageMap[category] || []
  if (categoryImages.length === 0) {
    // Fallback to a reliable placeholder service
    return `https://placehold.co/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(category)}`
  }
  
  const imageUrl = categoryImages[(index - 1) % categoryImages.length]
  return imageUrl
}

// Sample locations in San Francisco Bay Area
const locations = [
  { lat: 37.7749, lng: -122.4194, address: 'Downtown San Francisco, CA' },
  { lat: 37.7849, lng: -122.4094, address: 'Mission District, San Francisco, CA' },
  { lat: 37.7649, lng: -122.4294, address: 'Castro District, San Francisco, CA' },
  { lat: 37.8044, lng: -122.2712, address: 'Berkeley, CA' },
  { lat: 37.6879, lng: -122.4702, address: 'Daly City, CA' },
  { lat: 37.5407, lng: -122.2999, address: 'San Mateo, CA' },
  { lat: 37.4419, lng: -122.1430, address: 'Palo Alto, CA' },
  { lat: 37.3861, lng: -122.0839, address: 'Mountain View, CA' },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.notification.deleteMany()
  await prisma.adminAction.deleteMany()
  await prisma.report.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.message.deleteMany()
  await prisma.messageThread.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Electronics', slug: 'electronics' },
    }),
    prisma.category.create({
      data: { name: 'Furniture', slug: 'furniture' },
    }),
    prisma.category.create({
      data: { name: 'Clothing', slug: 'clothing' },
    }),
    prisma.category.create({
      data: { name: 'Books', slug: 'books' },
    }),
    prisma.category.create({
      data: { name: 'Sports & Recreation', slug: 'sports-recreation' },
    }),
    prisma.category.create({
      data: { name: 'Home & Garden', slug: 'home-garden' },
    }),
    prisma.category.create({
      data: { name: 'Automotive', slug: 'automotive' },
    }),
    prisma.category.create({
      data: { name: 'Art & Collectibles', slug: 'art-collectibles' },
    }),
  ])

  const [electronics, furniture, clothing, books, sports, homeGarden, automotive, artCollectibles] = categories

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Tech enthusiast and marketplace power user. Love finding great deals on electronics and gadgets.',
        location: 'San Francisco, CA',
        phoneNumber: '+1-555-0123',
        rating: 4.5,
        totalRatings: 15,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        bio: 'Interior designer selling beautiful furniture and home decor items.',
        location: 'Berkeley, CA',
        phoneNumber: '+1-555-0234',
        rating: 4.8,
        totalRatings: 22,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mike Chen',
        email: 'mike@example.com',
        bio: 'Sports enthusiast and gear collector. Always have quality equipment for sale.',
        location: 'Palo Alto, CA',
        phoneNumber: '+1-555-0345',
        rating: 4.2,
        totalRatings: 8,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        bio: 'Book lover and teacher. Selling textbooks and novels in great condition.',
        location: 'San Mateo, CA',
        phoneNumber: '+1-555-0456',
        rating: 4.9,
        totalRatings: 31,
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Kim',
        email: 'david@example.com',
        bio: 'Fashion enthusiast with a curated collection of vintage and designer items.',
        location: 'Mountain View, CA',
        phoneNumber: '+1-555-0567',
        rating: 4.3,
        totalRatings: 12,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        bio: 'Marketplace administrator ensuring safe and fair trading for everyone.',
        location: 'San Francisco, CA',
        isAdmin: true,
        rating: 5.0,
        totalRatings: 5,
      },
    }),
  ])

  const [john, sarah, mike, emily, david, admin] = users

  // Create comprehensive listings
  const listings = [
    // Electronics
    {
      title: 'iPhone 14 Pro - Space Black 256GB',
      description: 'iPhone 14 Pro in excellent condition. Barely used for 6 months. Comes with original box, charger, and unused EarPods. No scratches or damage. Battery health at 98%. Unlocked and ready to use with any carrier.',
      price: 85000,
      condition: 'LIKE_NEW',
      images: [getRandomImage('phone', 1), getRandomImage('phone', 2)],
      userId: john.id,
      categoryId: electronics.id,
    },
    {
      title: 'MacBook Air M2 13-inch - Silver',
      description: 'MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for students and professionals. Used for light work only. Includes original charger and box. No dents or major scratches.',
      price: 95000,
      condition: 'GOOD',
      images: [getRandomImage('laptop', 1), getRandomImage('laptop', 2), getRandomImage('laptop', 3)],
      userId: sarah.id,
      categoryId: electronics.id,
    },
    {
      title: 'Sony WH-1000XM4 Noise Canceling Headphones',
      description: 'Premium wireless headphones with industry-leading noise cancellation. Barely used, like new condition. Includes carrying case and all original accessories.',
      price: 25000,
      condition: 'LIKE_NEW',
      images: [getRandomImage('headphones', 1)],
      userId: mike.id,
      categoryId: electronics.id,
    },
    {
      title: 'iPad Pro 11-inch 2022 with Apple Pencil',
      description: 'iPad Pro with M2 chip, 128GB, Space Gray. Includes 2nd generation Apple Pencil. Perfect for digital art, note-taking, and productivity. Screen protector applied since day one.',
      price: 75000,
      condition: 'LIKE_NEW',
      images: [getRandomImage('tablet', 1), getRandomImage('tablet', 2)],
      userId: emily.id,
      categoryId: electronics.id,
    },

    // Furniture
    {
      title: 'Mid-Century Modern Dining Table - Walnut',
      description: 'Beautiful walnut dining table seats 6 people comfortably. Authentic mid-century piece from the 1960s. Some minor wear consistent with age but structurally sound and beautiful.',
      price: 68000,
      condition: 'GOOD',
      images: [getRandomImage('table', 1), getRandomImage('table', 2)],
      userId: sarah.id,
      categoryId: furniture.id,
    },
    {
      title: 'IKEA POÄNG Armchair - Birch Veneer',
      description: 'Comfortable armchair with birch veneer frame and beige cushion. Great condition, no stains or tears. Perfect for reading nook or living room.',
      price: 12000,
      condition: 'GOOD',
      images: [getRandomImage('chair', 1)],
      userId: david.id,
      categoryId: furniture.id,
    },
    {
      title: 'Queen Size Platform Bed Frame - White Oak',
      description: 'Minimalist platform bed frame made from solid white oak. No box spring needed. Excellent condition, used for only 1 year. Easy to disassemble for moving.',
      price: 45000,
      condition: 'LIKE_NEW',
      images: [getRandomImage('bed', 1), getRandomImage('bed', 2)],
      userId: john.id,
      categoryId: furniture.id,
    },

    // Clothing
    {
      title: 'Vintage Levi\'s 501 Jeans - Size 32x34',
      description: 'Classic Levi\'s 501 jeans from the 1990s. Perfect vintage fade and fit. Size 32 waist, 34 length. No holes or major wear. A true vintage find!',
      price: 8500,
      condition: 'GOOD',
      images: [],
      userId: david.id,
      categoryId: clothing.id,
    },
    {
      title: 'Patagonia Down Jacket - Men\'s Large Navy',
      description: 'Patagonia Down Sweater Jacket in navy blue, size Large. Excellent condition, rarely worn. Perfect for hiking and cold weather. Packs down small for travel.',
      price: 15000,
      condition: 'LIKE_NEW',
      images: [],
      userId: mike.id,
      categoryId: clothing.id,
    },
    {
      title: 'Designer Handbag - Michael Kors',
      description: 'Authentic Michael Kors leather handbag in brown. Good condition with minor signs of use. All zippers work perfectly. Great everyday bag.',
      price: 12000,
      condition: 'GOOD',
      images: [],
      userId: emily.id,
      categoryId: clothing.id,
    },

    // Books
    {
      title: 'Computer Science Textbook Bundle',
      description: 'Set of 5 computer science textbooks including Data Structures & Algorithms, Operating Systems, and Database Systems. Perfect for CS students. All in good condition.',
      price: 15000,
      condition: 'GOOD',
      images: [],
      userId: emily.id,
      categoryId: books.id,
    },
    {
      title: 'Harry Potter Complete Series - Hardcover',
      description: 'Complete Harry Potter series in hardcover. All 7 books in excellent condition. Perfect for collectors or new readers. No damage to dust jackets.',
      price: 8000,
      condition: 'LIKE_NEW',
      images: [],
      userId: sarah.id,
      categoryId: books.id,
    },

    // Sports & Recreation
    {
      title: 'Road Bike - Trek Domane AL 2',
      description: 'Trek road bike in excellent condition. Size 56cm frame, perfect for riders 5\'8" to 6\'0". Recently tuned up with new tires. Great for commuting or weekend rides.',
      price: 65000,
      condition: 'GOOD',
      images: [],
      userId: mike.id,
      categoryId: sports.id,
    },
    {
      title: 'Yoga Mat Set with Blocks and Strap',
      description: 'Complete yoga set including premium 6mm mat, two cork blocks, and cotton strap. Lightly used, excellent condition. Perfect for home practice.',
      price: 4500,
      condition: 'LIKE_NEW',
      images: [],
      userId: sarah.id,
      categoryId: sports.id,
    },

    // Home & Garden
    {
      title: 'KitchenAid Stand Mixer - Red',
      description: 'Classic KitchenAid Artisan stand mixer in Empire Red. 5-quart capacity, perfect for baking. Includes dough hook, wire whip, and flat beater. Excellent condition.',
      price: 25000,
      condition: 'GOOD',
      images: [],
      userId: emily.id,
      categoryId: homeGarden.id,
    },
    {
      title: 'Garden Tool Set - Complete Kit',
      description: 'Professional garden tool set with shovel, rake, pruning shears, hand trowel, and more. All tools in good condition. Perfect for the gardening enthusiast.',
      price: 7500,
      condition: 'GOOD',
      images: [],
      userId: john.id,
      categoryId: homeGarden.id,
    },

    // Art & Collectibles
    {
      title: 'Vintage Vinyl Records - Classic Rock Collection',
      description: 'Collection of 20+ vintage vinyl records from the 60s-80s. Includes Beatles, Led Zeppelin, Pink Floyd, and more. Most in VG+ condition.',
      price: 15000,
      condition: 'GOOD',
      images: [],
      userId: david.id,
      categoryId: artCollectibles.id,
    },
  ]

  // Create all listings
  const createdListings = []
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i]
    const location = locations[i % locations.length]
    
    const createdListing = await prisma.listing.create({
      data: {
        ...listing,
        locationLat: location.lat,
        locationLng: location.lng,
        address: location.address,
        views: Math.floor(Math.random() * 100) + 10,
        isFeatured: Math.random() > 0.8, // 20% chance of being featured
      },
    })
    createdListings.push(createdListing)
  }

  console.log('📦 Created listings...')

  // Create some offers
  const offers = [
    {
      listingId: createdListings[0].id, // iPhone
      buyerId: sarah.id,
      amount: 80000,
      message: 'Would you accept $800? I can pick up today.',
      status: 'PENDING',
    },
    {
      listingId: createdListings[1].id, // MacBook
      buyerId: mike.id,
      amount: 90000,
      message: 'Interested in this MacBook. Is the price negotiable?',
      status: 'PENDING',
    },
    {
      listingId: createdListings[4].id, // Dining table
      buyerId: john.id,
      amount: 65000,
      message: 'Beautiful table! Would you consider $650?',
      status: 'DECLINED',
    },
  ]

  for (const offer of offers) {
    await prisma.offer.create({ data: offer })
  }

  console.log('💰 Created offers...')

  // Create message threads and messages
  const thread1 = await prisma.messageThread.create({
    data: {
      listingId: createdListings[0].id,
      buyerId: sarah.id,
      sellerId: john.id,
    },
  })

  const thread2 = await prisma.messageThread.create({
    data: {
      listingId: createdListings[1].id,
      buyerId: mike.id,
      sellerId: sarah.id,
    },
  })

  const messages = [
    {
      threadId: thread1.id,
      senderId: sarah.id,
      content: 'Hi! I\'m interested in your iPhone. Is it still available?',
      type: 'TEXT',
    },
    {
      threadId: thread1.id,
      senderId: john.id,
      content: 'Yes, it\'s still available! It\'s in excellent condition. Would you like to see more photos?',
      type: 'TEXT',
    },
    {
      threadId: thread1.id,
      senderId: sarah.id,
      content: 'That would be great! Also, would you accept $800?',
      type: 'TEXT',
    },
    {
      threadId: thread2.id,
      senderId: mike.id,
      content: 'Hello! What\'s the battery cycle count on this MacBook?',
      type: 'TEXT',
    },
    {
      threadId: thread2.id,
      senderId: sarah.id,
      content: 'Hi Mike! The cycle count is only 127. It\'s been barely used.',
      type: 'TEXT',
    },
  ]

  for (const message of messages) {
    await prisma.message.create({ data: message })
  }

  console.log('💬 Created messages...')

  // Create ratings
  const ratings = [
    {
      userId: john.id,
      raterId: sarah.id,
      rating: 5,
      comment: 'Great seller! Item exactly as described and fast communication.',
      listingId: createdListings[0].id,
    },
    {
      userId: sarah.id,
      raterId: mike.id,
      rating: 5,
      comment: 'Excellent condition laptop, very happy with the purchase!',
      listingId: createdListings[1].id,
    },
    {
      userId: mike.id,
      raterId: emily.id,
      rating: 4,
      comment: 'Good quality bike, minor scratches but good value.',
      listingId: createdListings[11].id,
    },
  ]

  for (const rating of ratings) {
    await prisma.rating.create({ data: rating })
  }

  console.log('⭐ Created ratings...')

  // Create notifications
  const notifications = [
    {
      userId: john.id,
      type: 'NEW_MESSAGE',
      title: 'New message about iPhone 14 Pro',
      content: 'Sarah Wilson sent you a message about your iPhone listing.',
      listingId: createdListings[0].id,
    },
    {
      userId: sarah.id,
      type: 'NEW_OFFER',
      title: 'New offer received',
      content: 'Mike Chen made an offer on your MacBook Air.',
      listingId: createdListings[1].id,
    },
    {
      userId: mike.id,
      type: 'OFFER_DECLINED',
      title: 'Offer declined',
      content: 'Your offer on the dining table was declined.',
      listingId: createdListings[4].id,
    },
  ]

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification })
  }

  console.log('🔔 Created notifications...')

  // Update user ratings based on created ratings
  for (const user of users) {
    const userRatings = await prisma.rating.findMany({
      where: { userId: user.id },
    })
    
    if (userRatings.length > 0) {
      const avgRating = userRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / userRatings.length
      await prisma.user.update({
        where: { id: user.id },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          totalRatings: userRatings.length,
        },
      })
    }
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   • ${await prisma.category.count()} categories`)
  console.log(`   • ${await prisma.user.count()} users`)
  console.log(`   • ${await prisma.listing.count()} listings`)
  console.log(`   • ${await prisma.offer.count()} offers`)
  console.log(`   • ${await prisma.messageThread.count()} message threads`)
  console.log(`   • ${await prisma.message.count()} messages`)
  console.log(`   • ${await prisma.rating.count()} ratings`)
  console.log(`   • ${await prisma.notification.count()} notifications`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
