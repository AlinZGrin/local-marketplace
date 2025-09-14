'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  SlidersHorizontal,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'

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

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void
  showAdvanced?: boolean
  placeholder?: string
  className?: string
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'tools', label: 'Tools & Hardware' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'other', label: 'Other' }
]

const conditions = [
  { value: '', label: 'Any Condition' },
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
]

const sortOptions = [
  { value: 'createdAt', label: 'Date Posted' },
  { value: 'price', label: 'Price' },
  { value: 'title', label: 'Title' },
  { value: 'viewCount', label: 'Popularity' }
]

const radiusOptions = [
  { value: '5', label: 'Within 5 miles' },
  { value: '10', label: 'Within 10 miles' },
  { value: '25', label: 'Within 25 miles' },
  { value: '50', label: 'Within 50 miles' },
  { value: '100', label: 'Within 100 miles' },
  { value: '', label: 'Any distance' }
]

export function SearchBar({ 
  onSearch, 
  showAdvanced = false, 
  placeholder = "Search for items...",
  className = ""
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(showAdvanced)
  const [userLocation, setUserLocation] = useState<string>('')
  
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

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query)

  const handleSearch = useCallback((searchFilters: SearchFilters) => {
    // Update URL params
    const params = new URLSearchParams()
    
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value)
      }
    })

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : ''
    
    router.push(`/listings${newUrl}`)
    
    // Call external search handler if provided
    if (onSearch) {
      onSearch(searchFilters)
    }
  }, [router, onSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filters.query)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters.query])

  useEffect(() => {
    if (debouncedQuery !== filters.query) {
      handleSearch({ ...filters, query: debouncedQuery })
    }
  }, [debouncedQuery, filters, handleSearch])

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // For non-query changes, search immediately
    if (key !== 'query') {
      handleSearch(newFilters)
    }
  }

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      radius: '25',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
    setFilters(clearedFilters)
    handleSearch(clearedFilters)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // In a real app, you would use a geocoding service to get the address
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setUserLocation(locationString)
          handleFilterChange('location', locationString)
        } catch (error) {
          console.error('Error getting location:', error)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location')
      }
    )
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'query' || key === 'sortBy' || key === 'sortOrder') return false
    return value && value !== ''
  })

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <Select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <div className="flex space-x-2">
                  <Select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="flex-1"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <span className="flex items-center text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Location & Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter location"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      className="flex-shrink-0"
                    >
                      Use Current
                    </Button>
                  </div>
                  <Select
                    value={filters.radius}
                    onChange={(e) => handleFilterChange('radius', e.target.value)}
                  >
                    {radiusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default SearchBar