'use client'

import React from 'react'
import { MessageThread } from '@/components/messaging/MessageThread'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

interface MessageThreadPageProps {
  params: {
    threadId: string
  }
}

export default function MessageThreadPage({ params }: MessageThreadPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleBack = () => {
    router.push('/messages')
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ChatBubbleLeftIcon className="h-16 w-16 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Sign in to view messages</h2>
        <p className="text-sm text-center mb-4">
          You need to be signed in to access your conversations
        </p>
        <Button onClick={() => window.location.href = '/auth/signin'}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white">
      <MessageThread 
        threadId={params.threadId}
        onBack={handleBack}
      />
    </div>
  )
}