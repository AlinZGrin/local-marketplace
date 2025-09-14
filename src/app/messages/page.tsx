'use client'

import React, { useState } from 'react'
import { MessageList } from '@/components/messaging/MessageList'
import { MessageThread } from '@/components/messaging/MessageThread'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [isMobileThreadView, setIsMobileThreadView] = useState(false)

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId)
    setIsMobileThreadView(true)
  }

  const handleBackToList = () => {
    setIsMobileThreadView(false)
    setSelectedThreadId(null)
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
      <div className="h-full flex">
        {/* Messages List - Desktop: Always visible, Mobile: Hidden when thread selected */}
        <div className={`
          w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white
          ${isMobileThreadView ? 'hidden md:block' : 'block'}
        `}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            </div>
            
            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
              <MessageList 
                onThreadSelect={handleThreadSelect}
                selectedThreadId={selectedThreadId || undefined}
              />
            </div>
          </div>
        </div>

        {/* Message Thread - Desktop: Always visible, Mobile: Shown when thread selected */}
        <div className={`
          flex-1 bg-gray-50
          ${!isMobileThreadView ? 'hidden md:flex' : 'flex'}
        `}>
          {selectedThreadId ? (
            <MessageThread 
              threadId={selectedThreadId}
              onBack={handleBackToList}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ChatBubbleLeftIcon className="h-16 w-16 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-sm text-center">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}