'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate email format
      if (!formData.email || !formData.email.includes('@')) {
        setError('Please enter a valid email address.')
        setLoading(false)
        return
      }

      // List of valid demo emails
      const validEmails = [
        'admin@example.com',
        'john@example.com', 
        'sarah@example.com',
        'mike@example.com',
        'emily@example.com',
        'david@example.com'
      ]

      if (!validEmails.includes(formData.email)) {
        setError(`User not found. Try one of the demo emails: ${validEmails.slice(0, 3).join(', ')}`)
        setLoading(false)
        return
      }

      // Use NextAuth demo credentials login
      const result = await signIn('demo', {
        email: formData.email,
        redirect: false
      })

      if (result?.error) {
        setError(`Login failed: ${result.error}. Try one of the demo accounts.`)
      } else if (result?.ok) {
        router.push('/') // Redirect to home page
      } else {
        setError('Login failed. Please try again.')
      }

    } catch (error) {
      console.error('Sign in error:', error)
      setError('Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              view demo account information
            </Link>
          </p>
        </div>

        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter demo email (e.g., admin@example.com)"
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing In...' : 'Sign In (Demo)'}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Demo accounts:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'admin@example.com' })}
                  className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100"
                >
                  admin@example.com<br/>
                  <span className="text-gray-600">Admin user</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'john@example.com' })}
                  className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100"
                >
                  john@example.com<br/>
                  <span className="text-gray-600">Regular user</span>
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}