'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { 
  Upload, 
  X, 
  MapPin, 
  DollarSign, 
  Package, 
  ImageIcon,
  AlertCircle 
} from 'lucide-react'

interface ListingFormData {
  title: string
  description: string
  price: string
  category: string
  condition: string
  location: string
  images: File[]
}

interface ListingFormProps {
  initialData?: Partial<ListingFormData>
  listingId?: string
  onSuccess?: () => void
}

const categories = [
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
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
]

export function ListingForm({ initialData, listingId, onSuccess }: ListingFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<ListingFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
    condition: initialData?.condition || 'good',
    location: initialData?.location || '',
    images: []
  })

  const [imagePreview, setImagePreview] = useState<string[]>([])

  const handleInputChange = (field: keyof ListingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 8) {
      setErrors(prev => ({ ...prev, images: 'Maximum 8 images allowed' }))
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, images: 'Only image files are allowed' }))
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({ ...prev, images: 'Images must be smaller than 5MB' }))
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }))
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      setImagePreview(prev => [...prev, ...newPreviews])
      
      setErrors(prev => ({ ...prev, images: '' }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    
    setImagePreview(prev => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index])
      return newPreviews
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.images.length === 0 && !listingId) {
      newErrors.images = 'At least one image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // First, upload images if there are any
      let imageUrls: string[] = []
      
      if (formData.images.length > 0) {
        const imageFormData = new FormData()
        formData.images.forEach((file, index) => {
          imageFormData.append(`image-${index}`, file)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images')
        }

        const uploadResult = await uploadResponse.json()
        imageUrls = uploadResult.urls
      }

      // Create or update listing
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        images: imageUrls
      }

      const url = listingId ? `/api/listings/${listingId}` : '/api/listings'
      const method = listingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listingData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save listing')
      }

      const result = await response.json()

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/listings/${result.id}`)
      }
    } catch (error) {
      console.error('Error saving listing:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save listing' })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by this browser' }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Here you would typically use a geocoding service to convert coordinates to address
          // For now, we'll just use a placeholder
          const { latitude, longitude } = position.coords
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          handleInputChange('location', locationString)
        } catch (error) {
          setErrors(prev => ({ ...prev, location: 'Failed to get location' }))
        }
      },
      (error) => {
        setErrors(prev => ({ ...prev, location: 'Failed to get location' }))
      }
    )
  }

  if (!session?.user) {
    return (
      <Card className="text-center py-12">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in required</h3>
        <p className="text-gray-600 mb-4">You need to be signed in to create a listing.</p>
        <Button onClick={() => router.push('/auth/signin')}>
          Sign In
        </Button>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {listingId ? 'Edit Listing' : 'Create New Listing'}
        </h1>
        <p className="text-gray-600 mt-2">
          {listingId ? 'Update your listing details' : 'List your item for sale'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What are you selling?"
              error={errors.title}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your item in detail..."
              rows={4}
              error={errors.description}
              maxLength={1000}
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  error={errors.price}
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                error={errors.category}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <Select
              id="condition"
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                    className="pl-10"
                    error={errors.location}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="flex-shrink-0"
              >
                Use Current
              </Button>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images {!listingId && '*'}
            </label>
            
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images (max 8, 5MB each)
                </span>
              </label>
            </div>

            {errors.images && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.images}
              </p>
            )}

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {listingId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  {listingId ? 'Update Listing' : 'Create Listing'}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}