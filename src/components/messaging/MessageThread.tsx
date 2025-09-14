'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import MessageForm from './MessageForm'
import { 
  ArrowLeftIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  readAt?: string
  sender: {
    id: string
    name: string
    image?: string
  }
}

interface MessageThreadData {
  id: string
  listing: {
    id: string
    title: string
    images: string[]
    price: number
    seller: {
      id: string
      name: string
      image?: string
    }
  }
  participants: Array<{
    id: string
    name: string
    image?: string
  }>
  messages: Message[]
}

interface MessageThreadProps {
  threadId: string
  onBack?: () => void
}

export function MessageThread({ threadId, onBack }: MessageThreadProps) {
  const { data: session } = useSession()
  const [thread, setThread] = useState<MessageThreadData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const markAsRead = useCallback(async () => {
    try {
      await fetch(`/api/messages/threads/${threadId}/read`, {
        method: 'POST'
      })
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }, [threadId])

  const fetchThread = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/messages/threads/${threadId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch thread')
      }

      const data = await response.json()
      setThread(data.thread)
      setMessages(data.thread.messages || [])
      
      // Mark messages as read
      markAsRead()
    } catch (err) {
      console.error('Error fetching thread:', err)
      setError(err instanceof Error ? err.message : 'Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }, [threadId, markAsRead])

  useEffect(() => {
    if (threadId) {
      fetchThread()
    }
  }, [threadId, fetchThread])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (content: string) => {
    if (!thread || !session?.user) return

    setSendingMessage(true)
    try {
      const response = await fetch(`/api/messages/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const newMessage = await response.json()
      setMessages(prev => [...prev, newMessage.message])
    } catch (err) {
      console.error('Error sending message:', err)
      // You could show a toast notification here
    } finally {
      setSendingMessage(false)
    }
  }

  const getOtherParticipant = () => {
    if (!thread || !session?.user) return null
    return thread.participants.find(p => p.id !== session.user.id)
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return format(date, 'HH:mm')
    } else if (diffInDays === 1) {
      return `Yesterday ${format(date, 'HH:mm')}`
    } else {
      return format(date, 'MMM d, HH:mm')
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.createdAt)
      const dateKey = format(date, 'yyyy-MM-dd')
      
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs
    }))
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else {
      return format(date, 'MMMM d, yyyy')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            )}
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <InformationCircleIcon className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">
          {error || 'Conversation not found'}
        </p>
        <Button 
          onClick={fetchThread}
          className="mt-4"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    )
  }

  const otherUser = getOtherParticipant()
  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          )}
          <Avatar
            name={otherUser?.name || 'Unknown User'}
            src={otherUser?.image}
            size="md"
          />
          <div>
            <p className="font-medium text-gray-900">
              {otherUser?.name || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-500">
              {thread.listing.title} • ${thread.listing.price}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <EllipsisVerticalIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Listing Info */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
            {thread.listing.images[0] && (
              <img
                src={thread.listing.images[0]}
                alt={thread.listing.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {thread.listing.title}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              ${thread.listing.price}
            </p>
          </div>
          <Button variant="outline" size="sm">
            View Item
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageGroups.map(({ date, messages: dayMessages }) => (
          <div key={date}>
            {/* Date Header */}
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                {formatDateHeader(date)}
              </span>
            </div>

            {/* Messages for this day */}
            {dayMessages.map((message, index) => {
              const isCurrentUser = message.senderId === session?.user?.id
              const showAvatar = !isCurrentUser && (
                index === dayMessages.length - 1 || 
                dayMessages[index + 1]?.senderId !== message.senderId
              )

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                    {showAvatar && !isCurrentUser && (
                      <Avatar
                        name={message.sender.name}
                        src={message.sender.image}
                        size="sm"
                      />
                    )}
                    {!showAvatar && !isCurrentUser && (
                      <div className="w-8 h-8" /> // Spacer
                    )}
                    
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white">
        <MessageForm 
          onSendMessage={handleSendMessage}
          disabled={sendingMessage}
          placeholder={`Message ${otherUser?.name}...`}
        />
      </div>
    </div>
  )
}

export default MessageThread