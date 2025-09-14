'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { signIn } from 'next-auth/react'

export default function SignUpPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Local Marketplace
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This is a demo application. Use one of the existing demo accounts to sign in.
          </p>
        </div>

        <Card className="mt-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Demo Accounts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium text-sm">Admin Account</p>
                  <p className="text-sm text-gray-600">admin@example.com</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium text-sm">Regular Users</p>
                  <p className="text-sm text-gray-600">john@example.com</p>
                  <p className="text-sm text-gray-600">sarah@example.com</p>
                  <p className="text-sm text-gray-600">mike@example.com</p>
                  <p className="text-sm text-gray-600">emily@example.com</p>
                  <p className="text-sm text-gray-600">david@example.com</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth/signin')}
                variant="primary"
                className="w-full"
              >
                Go to Sign In
              </Button>
              
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full"
              >
                Browse as Guest
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}