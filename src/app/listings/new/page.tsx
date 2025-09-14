'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Plus } from 'lucide-react'

export default function NewListingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/listings" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p className="text-gray-600 mt-2">
            Share something with your community. Fill out the form below to create your listing.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h2>
          <p className="text-gray-600 mb-6">
            The listing creation feature is currently under development. 
            We&apos;re working hard to bring you the best experience for creating and managing your listings.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              In the meantime, you can:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/listings">
                <Button variant="outline">Browse Listings</Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline">Explore Categories</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}