'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Heart, MapPin, MessageCircle, DollarSign } from 'lucide-react'
import { formatPrice, timeAgo } from '@/utils/helpers'
import { useState } from 'react'

interface ListingCardProps {
  listing: {
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
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
    // TODO: Implement API call to save/remove favorite
  }

  const handleImageError = () => {
    setImageError(true)
    setIsImageLoaded(true)
  }

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-200" padding="none">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {listing.images[0] && !imageError ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className={`object-cover transition-transform duration-200 group-hover:scale-105 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onError={handleImageError}
            />
          ) : (
            // Fallback placeholder
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">No Image</span>
              </div>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              size={16} 
              className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
            />
          </button>

          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={listing.condition === 'NEW' ? 'success' : 'secondary'}
              size="sm"
            >
              {listing.condition.replace('_', ' ')}
            </Badge>
          </div>

          {/* Loading Skeleton */}
          {!isImageLoaded && !imageError && listing.images[0] && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Price and Title */}
          <div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatPrice(listing.price)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>

          {/* Location and Time */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span className="truncate">{listing.locationAddr}</span>
            </div>
            <span>{timeAgo(new Date(listing.createdAt))}</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Avatar 
                src={listing.user.image} 
                name={listing.user.name || 'Unknown'} 
                size="xs" 
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {listing.user.name || 'Anonymous'}
                </div>
                {listing.user.rating > 0 && (
                  <div className="text-yellow-500">
                    ★ {listing.user.rating.toFixed(1)}
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {listing._count?.offers && listing._count.offers > 0 && (
                <div className="flex items-center space-x-1">
                  <DollarSign size={12} />
                  <span>{listing._count.offers}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <MessageCircle size={12} />
                <span>Chat</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ListingCard