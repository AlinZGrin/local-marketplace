'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ListingCard } from '@/components/listings/ListingCard'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  condition: string
  images: string[]
  locationAddr: string
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
    rating: number
  }
  category?: {
    name: string
    slug: string
  }
  _count?: {
    offers: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function CategoryPage() {
  const params = useParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params?.slug) {
      fetchCategoryAndListings(params.slug as string)
    }
  }, [params?.slug])

  const fetchCategoryAndListings = async (slug: string) => {
    try {
      // Fetch listings filtered by category
      const listingsResponse = await fetch(`/api/listings?category=${slug}`)
      if (!listingsResponse.ok) {
        throw new Error('Failed to fetch listings')
      }
      const listingsData = await listingsResponse.json()
      
      // The API returns an object with listings property, not a direct array
      const listingsArray = listingsData.listings || []
      setListings(listingsArray)

      // Extract category info from first listing or fetch separately
      if (listingsArray.length > 0 && listingsArray[0].category) {
        setCategory(listingsArray[0].category)
      } else {
        // If no listings, try to get category info separately
        const categoriesResponse = await fetch('/api/categories')
        const categories = await categoriesResponse.json()
        const foundCategory = categories.find((cat: Category) => cat.slug === slug)
        if (foundCategory) {
          setCategory(foundCategory)
        }
      }
    } catch (err) {
      setError('Failed to load category')
      console.error('Error fetching category:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/categories">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/categories" className="hover:text-blue-600">Categories</Link>
          <span>/</span>
          <span className="text-gray-900">{category?.name || 'Unknown Category'}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category?.name || 'Category'}
        </h1>
        <p className="text-gray-600">
          {listings.length} listing{listings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Listings */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600 mb-6">
            There are no listings in this category yet. Be the first to add one!
          </p>
          <Link href="/listings/new">
            <Button>Create Listing</Button>
          </Link>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <Link href="/categories">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>
    </div>
  )
}