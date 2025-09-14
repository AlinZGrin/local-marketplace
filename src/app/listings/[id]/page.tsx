'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { 
  MapPin, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  DollarSign,
  ArrowLeft,
  Share2
} from 'lucide-react'
import { formatPrice, timeAgo } from '@/utils/helpers'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  condition: string
  images: string[]
  locationAddr: string
  createdAt: string
  views: number
  user: {
    id: string
    name: string | null
    image: string | null
    rating: number
    totalRatings: number
  }
  category: {
    name: string
    slug: string
  }
  _count: {
    offers: number
  }
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (params?.id) {
      fetchListing(params.id as string)
    }
  }, [params?.id])

  const fetchListing = async (id: string) => {
    try {
      const response = await fetch(`/api/listings/${id}`)
      if (!response.ok) {
        throw new Error('Listing not found')
      }
      const data = await response.json()
      setListing(data)
    } catch (err) {
      setError('Failed to load listing')
      console.error('Error fetching listing:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSeller = () => {
    // TODO: Implement messaging functionality
    alert('Messaging functionality coming soon!')
  }

  const handleMakeOffer = () => {
    // TODO: Implement offer functionality  
    alert('Offer functionality coming soon!')
  }

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // TODO: Implement favorite functionality
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-8">The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/listings">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/listings" className="hover:text-blue-600">Listings</Link>
        <span>/</span>
        <Link href={`/categories/${listing.category.slug}`} className="hover:text-blue-600">
          {listing.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            {listing.images.length > 0 ? (
              <Image
                src={listing.images[selectedImageIndex]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">No Images</span>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="text-3xl font-bold text-green-600">{formatPrice(listing.price)}</div>
          </div>

          {/* Condition and Category */}
          <div className="flex items-center space-x-3">
            <Badge variant={listing.condition === 'NEW' ? 'success' : 'secondary'}>
              {listing.condition.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary">{listing.category.name}</Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{listing.locationAddr}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar size={16} />
              <span className="text-sm">{timeAgo(new Date(listing.createdAt))}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Eye size={16} />
              <span className="text-sm">{listing.views} views</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <DollarSign size={16} />
              <span className="text-sm">{listing._count.offers} offers</span>
            </div>
          </div>

          {/* Seller Info */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
            <div className="flex items-center space-x-3">
              <Avatar 
                src={listing.user.image} 
                name={listing.user.name || 'Unknown'} 
                size="md" 
              />
              <div>
                <div className="font-medium text-gray-900">
                  {listing.user.name || 'Anonymous'}
                </div>
                {listing.user.rating > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-yellow-500">
                    <span>★ {listing.user.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({listing.user.totalRatings} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleContactSeller} className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              <Button onClick={handleMakeOffer} variant="outline" className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Make Offer
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleToggleFavorite} 
                variant="outline" 
                className="w-full"
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link href="/listings">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
      </div>
    </div>
  )
}