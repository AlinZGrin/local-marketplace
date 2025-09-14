import { Prisma } from '@prisma/client'

// User Types
export type User = {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  phone: string | null
  bio: string | null
  locationLat: number | null
  locationLng: number | null
  locationAddr: string | null
  rating: number
  totalRatings: number
  isActive: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserWithListings = Prisma.UserGetPayload<{
  include: { listings: true }
}>

export type UserProfile = Pick<User, 'id' | 'name' | 'image' | 'bio' | 'rating' | 'totalRatings' | 'createdAt'>

// Listing Types
export type Listing = {
  id: string
  title: string
  description: string
  price: number
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR'
  images: string[]
  locationLat: number
  locationLng: number
  locationAddr: string
  sellerId: string
  categoryId: string
  status: 'ACTIVE' | 'SOLD' | 'INACTIVE' | 'SUSPENDED' | 'DELETED'
  featured: boolean
  featuredUntil: Date | null
  views: number
  isNegotiable: boolean
  createdAt: Date
  updatedAt: Date
}

export type ListingWithDetails = Prisma.ListingGetPayload<{
  include: {
    seller: {
      select: {
        id: true
        name: true
        image: true
        rating: true
        totalRatings: true
      }
    }
    category: true
    _count: {
      select: {
        offers: true
        threads: true
      }
    }
  }
}>

export type ListingFormData = {
  title: string
  description: string
  price: number
  condition: Listing['condition']
  categoryId: string
  images: string[]
  location: {
    lat: number
    lng: number
    address: string
  }
  isNegotiable: boolean
}

// Message Types
export type MessageThread = {
  id: string
  listingId: string
  createdAt: Date
  updatedAt: Date
}

export type MessageThreadWithDetails = Prisma.MessageThreadGetPayload<{
  include: {
    listing: {
      select: {
        id: true
        title: true
        price: true
        images: true
        status: true
      }
    }
    participants: {
      select: {
        id: true
        name: true
        image: true
      }
    }
    messages: {
      take: 1
      orderBy: { createdAt: 'desc' }
      include: {
        sender: {
          select: {
            id: true
            name: true
          }
        }
      }
    }
  }
}>

export type Message = {
  id: string
  threadId: string
  senderId: string
  content: string
  type: 'TEXT' | 'OFFER' | 'IMAGE' | 'SYSTEM'
  metadata: any
  isRead: boolean
  createdAt: Date
}

export type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        id: true
        name: true
        image: true
      }
    }
  }
}>

// Offer Types
export type Offer = {
  id: string
  listingId: string
  buyerId: string
  amount: number
  message: string | null
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'WITHDRAWN'
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type OfferWithDetails = Prisma.OfferGetPayload<{
  include: {
    buyer: {
      select: {
        id: true
        name: true
        image: true
        rating: true
      }
    }
    listing: {
      select: {
        id: true
        title: true
        price: true
        images: true
        sellerId: true
      }
    }
  }
}>

// Category Types
export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  parentId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export type CategoryWithCount = Category & {
  _count: {
    listings: number
  }
}

// Rating Types
export type Rating = {
  id: string
  giverId: string
  receiverId: string
  listingId: string | null
  score: number
  comment: string | null
  createdAt: Date
}

export type RatingWithDetails = Prisma.RatingGetPayload<{
  include: {
    giver: {
      select: {
        id: true
        name: true
        image: true
      }
    }
  }
}>

// Report Types
export type Report = {
  id: string
  reporterId: string
  listingId: string | null
  reportedUserId: string | null
  type: 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'FRAUD' | 'HARASSMENT' | 'FAKE_LISTING' | 'OTHER'
  reason: string
  description: string | null
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
  resolvedBy: string | null
  resolvedAt: Date | null
  createdAt: Date
}

export type ReportWithDetails = Prisma.ReportGetPayload<{
  include: {
    reporter: {
      select: {
        id: true
        name: true
        email: true
      }
    }
    listing: {
      select: {
        id: true
        title: true
        seller: {
          select: {
            id: true
            name: true
          }
        }
      }
    }
    reportedUser: {
      select: {
        id: true
        name: true
        email: true
      }
    }
  }
}>

// Notification Types
export type Notification = {
  id: string
  userId: string
  type: 'NEW_MESSAGE' | 'NEW_OFFER' | 'OFFER_ACCEPTED' | 'OFFER_DECLINED' | 'LISTING_SOLD' | 'LISTING_FEATURED' | 'ACCOUNT_WARNING' | 'SYSTEM_MESSAGE'
  title: string
  message: string
  isRead: boolean
  metadata: any
  listingId: string | null
  messageId: string | null
  threadId: string | null
  offerId: string | null
  createdAt: Date
}

// Search and Filter Types
export type SearchFilters = {
  search: string
  category: string
  condition: string
  minPrice: string
  maxPrice: string
  radius: string
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'distance'
}

export type LocationData = {
  lat: number
  lng: number
  address: string
}

// API Response Types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form Types
export type LoginForm = {
  email: string
  password: string
}

export type RegisterForm = {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  location?: LocationData
}

export type ContactForm = {
  name: string
  email: string
  subject: string
  message: string
}

// Admin Types
export type AdminStats = {
  totalUsers: number
  totalListings: number
  totalMessages: number
  totalReports: number
  activeListings: number
  pendingReports: number
  monthlyGrowth: {
    users: number
    listings: number
  }
}

export type AdminAction = {
  id: string
  adminId: string
  type: 'SUSPEND_USER' | 'UNSUSPEND_USER' | 'DELETE_LISTING' | 'FEATURE_LISTING' | 'UNFEATURE_LISTING' | 'RESOLVE_REPORT' | 'DISMISS_REPORT' | 'SEND_WARNING'
  targetType: string
  targetId: string
  reason: string | null
  details: any
  reportId: string | null
  createdAt: Date
}

