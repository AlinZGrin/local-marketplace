'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  ChevronRightIcon, 
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline'

interface MessageThread {
  id: string
  listing: {
    id: string
    title: string
    images: string[]
    price: number
  }
  participants: Array<{
    id: string
    name: string
    image?: string
  }>
  lastMessage?: {
    id: string
    content: string
    senderId: string
    createdAt: string
  }
  unreadCount: number
  updatedAt: string
}

interface MessageListProps {
  onThreadSelect?: (threadId: string) => void
  selectedThreadId?: string
}

export function MessageList({ onThreadSelect, selectedThreadId }: MessageListProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchThreads()
    }
  }, [session])

  const fetchThreads = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages/threads')
      
      if (!response.ok) {
        throw new Error('Failed to fetch message threads')
      }

      const data = await response.json()
      setThreads(data.threads || [])
    } catch (err) {
      console.error('Error fetching threads:', err)
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const handleThreadClick = (threadId: string) => {
    if (onThreadSelect) {
      onThreadSelect(threadId)
    } else {
      router.push(`/messages/${threadId}`)
    }
  }

  const getOtherParticipant = (thread: MessageThread) => {
    return thread.participants.find(p => p.id !== session?.user?.id)
  }

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return format(date, 'HH:mm')
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return format(date, 'EEE')
    } else {
      return format(date, 'MMM d')
    }
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ChatBubbleLeftIcon className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">Please sign in to view messages</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <ChatBubbleLeftIcon className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">Error loading conversations</p>
        <p className="text-sm mt-2">{error}</p>
        <Button 
          onClick={fetchThreads}
          className="mt-4"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ChatBubbleLeftIcon className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">No conversations yet</p>
        <p className="text-sm mt-2">Start by messaging a seller about their listing</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {threads.map((thread) => {
        const otherUser = getOtherParticipant(thread)
        const isSelected = selectedThreadId === thread.id
        const hasUnread = thread.unreadCount > 0

        return (
          <div
            key={thread.id}
            onClick={() => handleThreadClick(thread.id)}
            className={`
              flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors
              ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
              ${hasUnread ? 'bg-blue-50/30' : ''}
            `}
          >
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <Avatar
                name={otherUser?.name || 'Unknown User'}
                src={otherUser?.image}
                size="md"
              />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium text-gray-900 truncate ${hasUnread ? 'font-semibold' : ''}`}>
                  {otherUser?.name || 'Unknown User'}
                </p>
                <div className="flex items-center space-x-2">
                  {hasUnread && (
                    <Badge variant="primary" size="sm">
                      {thread.unreadCount}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatLastMessageTime(thread.lastMessage?.createdAt || thread.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Listing Info */}
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0">
                  {thread.listing.images[0] && (
                    <img
                      src={thread.listing.images[0]}
                      alt={thread.listing.title}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {thread.listing.title} • ${thread.listing.price}
                </p>
              </div>

              {/* Last Message */}
              {thread.lastMessage && (
                <p className={`text-sm text-gray-600 truncate mt-1 ${hasUnread ? 'font-medium' : ''}`}>
                  {thread.lastMessage.senderId === session.user.id ? 'You: ' : ''}
                  {truncateMessage(thread.lastMessage.content)}
                </p>
              )}
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList