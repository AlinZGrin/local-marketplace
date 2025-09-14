'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { 
  MapPin, 
  Calendar, 
  Star, 
  MessageCircle, 
  Heart, 
  Share2, 
  Flag, 
  ShoppingBag,
  Edit,
  Eye,
  DollarSign,
  Package,
  User,
  Clock,
  Shield
} from 'lucide-react'
import { formatPrice, timeAgo } from '@/utils/helpers'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  location: string
  images: string[]
  status: string
  createdAt: string
  updatedAt: string
  isFeatured: boolean
  viewCount: number
  seller: {
    id: string
    name: string | null
    email: string
    image: string | null
    createdAt: string
    isVerified: boolean
    _count: {
      listings: number
      receivedRatings: number
    }
    averageRating?: number
  }
  _count: {
    offers: number
    favorites: number
  }
  isOwner?: boolean
  isFavorited?: boolean
}

interface ListingDetailProps {
  listingId: string
}

export function ListingDetail({ listingId }: ListingDetailProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchListing = useCallback(async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Listing not found')
        }
        throw new Error('Failed to load listing')
      }
      const data = await response.json()
      setListing(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load listing')
    } finally {
      setLoading(false)
    }
  }, [listingId])

  useEffect(() => {
    fetchListing()
  }, [fetchListing])

  const handleFavorite = async () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    setActionLoading('favorite')
    try {
      const response = await fetch(`/api/listings/${listingId}/favorite`, {
        method: listing?.isFavorited ? 'DELETE' : 'POST'
      })

      if (response.ok) {
        setListing(prev => prev ? {
          ...prev,
          isFavorited: !prev.isFavorited,
          _count: {
            ...prev._count,
            favorites: prev.isFavorited 
              ? prev._count.favorites - 1 
              : prev._count.favorites + 1
          }
        } : null)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleMessageSeller = () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (listing?.seller.id === session.user.id) {
      return // Can't message yourself
    }

    router.push(`/messages?seller=${listing?.seller.id}&listing=${listingId}`)
  }

  const handleMakeOffer = () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    router.push(`/offers/new?listing=${listingId}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: listing?.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleReport = () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }
    setShowReportModal(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Listing not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            The listing you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push('/listings')}>
            Browse Listings
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card padding="none" className="overflow-hidden">
            {listing.images.length > 0 ? (
              <div className="relative">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-96 object-cover"
                />
                
                {listing.images.length > 1 && (
                  <>
                    {/* Image Navigation */}
                    <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Thumbnail Strip */}
                    <div className="flex space-x-2 p-4 overflow-x-auto">
                      {listing.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${listing.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </Card>

          {/* Listing Info */}
          <Card>
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {listing.isFeatured && (
                      <Badge variant="primary">Featured</Badge>
                    )}
                    <Badge variant="secondary">{listing.category}</Badge>
                    <Badge variant={
                      listing.condition === 'new' ? 'success' :
                      listing.condition === 'like_new' ? 'primary' : 'secondary'
                    }>
                      {listing.condition.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {timeAgo(new Date(listing.createdAt))}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {listing.viewCount} views
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavorite}
                    disabled={!!actionLoading}
                  >
                    <Heart className={`h-4 w-4 ${listing.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReport}>
                    <Flag className="h-4 w-4" />
                  </Button>
                  {listing.isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/listings/${listingId}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-4">
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(listing.price)}
                </div>
                {listing._count.offers > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {listing._count.offers} offer{listing._count.offers !== 1 ? 's' : ''} received
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Seller Information</h3>
              
              <div className="flex items-center space-x-3">
                <Avatar
                  src={listing.seller.image}
                  name={listing.seller.name || 'Seller'}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {listing.seller.name || 'Anonymous'}
                    </h4>
                    {listing.seller.isVerified && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(listing.seller.createdAt).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {listing.seller._count.listings}
                  </div>
                  <div className="text-sm text-gray-500">Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                    {listing.seller.averageRating ? (
                      <>
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {listing.seller.averageRating.toFixed(1)}
                      </>
                    ) : (
                      'New'
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {listing.seller._count.receivedRatings > 0 
                      ? `${listing.seller._count.receivedRatings} reviews`
                      : 'No reviews'
                    }
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              {!listing.isOwner && listing.status === 'ACTIVE' && (
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleMessageSeller}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Seller
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleMakeOffer}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Make Offer
                  </Button>
                </div>
              )}

              {listing.status !== 'ACTIVE' && (
                <div className="pt-4 border-t border-gray-100">
                  <Badge variant="secondary" className="w-full justify-center">
                    {listing.status === 'SOLD' ? 'Sold' : 'Not Available'}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Safety Tips */}
          <Card>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Safety Tips
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Meet in a public place</li>
                <li>• Inspect item before payment</li>
                <li>• Use secure payment methods</li>
                <li>• Trust your instincts</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}