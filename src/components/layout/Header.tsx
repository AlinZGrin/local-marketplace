'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, Plus, MessageCircle, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LM</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Local Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/listings" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Categories
            </Link>
            {session && (
              <Link 
                href="/messages" 
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
              >
                <MessageCircle size={18} />
                <span>Messages</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {session ? (
              <>
                <Link href="/listings/new">
                  <Button
                    variant="primary"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Plus size={16} className="mr-1" />
                    Sell Item
                  </Button>
                </Link>

                {/* Notifications */}
                <NotificationCenter />

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <Avatar 
                      src={session.user?.image} 
                      name={session.user?.name || 'User'} 
                      size="sm" 
                    />
                    <span className="hidden sm:block text-sm font-medium">
                      {session.user?.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/listings/my-listings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Listings
                    </Link>
                    <Link 
                      href="/offers" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Offers
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50"
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link 
              href="/listings"
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse
            </Link>
            <Link 
              href="/categories"
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            {session && (
              <>
                <Link 
                  href="/messages"
                  className="block text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link 
                  href="/listings/new"
                  className="block bg-blue-600 text-white text-center py-2 px-4 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sell Item
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}