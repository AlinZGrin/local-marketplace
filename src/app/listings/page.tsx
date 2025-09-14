'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/listings/SearchBar'
import { ListingCard } from '@/components/listings/ListingCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Grid, 
  List, 
  Package, 
  Filter,
  MapPin,
  Calendar
} from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  condition: string
  locationAddr: string
  images: string[]
  createdAt: string
  seller: {
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

interface SearchFilters {
  query: string
  category: string
  condition: string
  minPrice: string
  maxPrice: string
  location: string
  radius: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams?.get('q') || '',
    category: searchParams?.get('category') || '',
    condition: searchParams?.get('condition') || '',
    minPrice: searchParams?.get('minPrice') || '',
    maxPrice: searchParams?.get('maxPrice') || '',
    location: searchParams?.get('location') || '',
    radius: searchParams?.get('radius') || '25',
    sortBy: searchParams?.get('sortBy') || 'createdAt',
    sortOrder: (searchParams?.get('sortOrder') as 'asc' | 'desc') || 'desc'
  })

  useEffect(() => {
    // Update filters when URL params change
    const newFilters: SearchFilters = {
      query: searchParams?.get('q') || '',
      category: searchParams?.get('category') || '',
      condition: searchParams?.get('condition') || '',
      minPrice: searchParams?.get('minPrice') || '',
      maxPrice: searchParams?.get('maxPrice') || '',
      location: searchParams?.get('location') || '',
      radius: searchParams?.get('radius') || '25',
      sortBy: searchParams?.get('sortBy') || 'createdAt',
      sortOrder: (searchParams?.get('sortOrder') as 'asc' | 'desc') || 'desc'
    }
    setFilters(newFilters)
    setPage(1)
    fetchListings(newFilters, 1, true)
  }, [searchParams])

  const fetchListings = async (searchFilters: SearchFilters, pageNum: number = 1, reset: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('page', pageNum.toString())
      params.set('limit', '20')

      // Add all filter params
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.set(key, value)
        }
      })

      const response = await fetch(`/api/listings?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }

      const data = await response.json()
      
      if (reset) {
        setListings(data.listings)
      } else {
        setListings(prev => [...prev, ...data.listings])
      }
      
      setHasMore(data.hasMore)
      setTotalCount(data.totalCount)
      setPage(pageNum)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    fetchListings(newFilters, 1, true)
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchListings(filters, page + 1, false)
    }
  }

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'query' || key === 'sortBy' || key === 'sortOrder') return false
      return value && value !== ''
    }).length
  }

  const renderEmptyState = () => {
    const hasFilters = getActiveFiltersCount() > 0 || filters.query

    return (
      <Card className="text-center py-16">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {hasFilters ? 'No listings found' : 'No listings yet'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {hasFilters 
            ? 'Try adjusting your search criteria or clearing some filters to see more results.'
            : 'Be the first to list an item in your area! Start selling today.'
          }
        </p>
        {hasFilters ? (
          <Button
            variant="outline"
            onClick={() => handleSearch({
              query: '',
              category: '',
              condition: '',
              minPrice: '',
              maxPrice: '',
              location: '',
              radius: '25',
              sortBy: 'createdAt',
              sortOrder: 'desc'
            })}
          >
            Clear all filters
          </Button>
        ) : (
          <Button variant="primary">
            List your first item
          </Button>
        )}
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Listings</h1>
        <p className="text-gray-600">Find great deals on items in your area</p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} showAdvanced />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {loading ? (
              'Searching...'
            ) : (
              <>
                {totalCount > 0 ? (
                  <>
                    Showing {listings.length} of {totalCount} listings
                    {getActiveFiltersCount() > 0 && (
                      <span className="ml-2 text-blue-600">
                        ({getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied)
                      </span>
                    )}
                  </>
                ) : (
                  'No listings found'
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="text-center py-8">
          <div className="text-red-600 mb-4">
            <Package className="h-12 w-12 mx-auto mb-2" />
            <p className="font-medium">Error loading listings</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchListings(filters, 1, true)}
          >
            Try Again
          </Button>
        </Card>
      )}

      {/* Loading State for initial load */}
      {loading && listings.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Listings Grid/List */}
      {!loading || listings.length > 0 ? (
        listings.length > 0 ? (
          <div className="space-y-6">
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          renderEmptyState()
        )
      ) : null}
    </div>
  )
}