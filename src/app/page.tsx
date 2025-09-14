import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Search, Shield, MessageCircle, Star, TrendingUp, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Buy & Sell <span className="text-blue-600">Locally</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with your neighbors to discover great deals on items near you. 
            Safe, simple, and community-focused.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Browse Items
              </Button>
            </Link>
            <Link href="/listings/new">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Local Marketplace?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make buying and selling in your community safe, easy, and enjoyable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">
              Verified users, secure messaging, and community reporting keep everyone safe.
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Communication</h3>
            <p className="text-gray-600">
              Built-in messaging system with offer management and real-time notifications.
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Community</h3>
            <p className="text-gray-600">
              Connect with neighbors and support your local community economy.
            </p>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600">
              Find exactly what you&apos;re looking for
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Electronics', emoji: '📱', count: '1.2k' },
              { name: 'Furniture', emoji: '🪑', count: '850' },
              { name: 'Clothing', emoji: '👕', count: '2.1k' },
              { name: 'Books', emoji: '📚', count: '650' },
              { name: 'Sports', emoji: '⚽', count: '420' },
              { name: 'Automotive', emoji: '🚗', count: '320' },
            ].map((category) => (
              <Link 
                key={category.name}
                href={`/listings?category=${category.name.toLowerCase()}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">125K+</div>
            <div className="text-gray-600">Items Sold</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">4.8★</div>
            <div className="text-gray-600">User Rating</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users already buying and selling in their local communities.
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}