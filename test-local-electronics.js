// Test local API for electronics
setTimeout(async () => {
  try {
    console.log('🧪 Testing local electronics API...')
    
    const response = await fetch('http://localhost:3000/api/listings?category=electronics')
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      console.log('❌ Response not OK')
      return
    }
    
    const data = await response.json()
    console.log('✅ API Response structure:', Object.keys(data))
    console.log('📊 Total count:', data.totalCount)
    console.log('📋 Listings count:', data.listings?.length || 0)
    
    if (data.listings && data.listings.length > 0) {
      console.log('\n📱 Electronics listings:')
      data.listings.forEach((listing, index) => {
        console.log(`  ${index + 1}. ${listing.title}`)
        console.log(`     Category: ${listing.category?.name || 'No category'}`)
        console.log(`     Images: ${listing.images?.length || 0}`)
      })
    } else {
      console.log('❌ No electronics listings found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}, 3000)

console.log('Starting local API test...')