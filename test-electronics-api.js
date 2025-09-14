// Test the API filtering for electronics
setTimeout(async () => {
  try {
    console.log('🧪 Testing electronics category API...')
    
    const response = await fetch('https://local-marketplace-2lyf8ourz-alins-projects-186a0c90.vercel.app/api/listings?category=electronics')
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const text = await response.text()
      console.log('Error response:', text)
      return
    }
    
    const data = await response.json()
    console.log('API Response structure:', Object.keys(data))
    console.log('Listings array length:', data.listings?.length || 0)
    console.log('Total count:', data.totalCount)
    
    if (data.listings && data.listings.length > 0) {
      console.log('\n📋 Electronics listings found:')
      data.listings.forEach((listing, index) => {
        console.log(`${index + 1}. ${listing.title}`)
        console.log(`   Category: ${listing.category?.name} (${listing.category?.slug})`)
        console.log(`   Images: ${listing.images?.length || 0}`)
      })
    } else {
      console.log('❌ No listings found in response')
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error)
  }
}, 2000)

console.log('Starting API test...')