'use client'

import React, { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { TextArea } from '@/components/ui/TextArea'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface MessageFormProps {
  onSendMessage: (message: string) => Promise<void> | void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function MessageForm({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message...",
  className = ""
}: MessageFormProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled || isSending) return

    const messageToSend = message.trim()
    setMessage('')
    setIsSending(true)

    try {
      await onSendMessage(messageToSend)
    } catch (error) {
      // Restore message on error
      setMessage(messageToSend)
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const isDisabled = disabled || isSending || !message.trim()

  return (
    <form onSubmit={handleSubmit} className={`flex items-end space-x-2 p-4 ${className}`}>
      <div className="flex-1">
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-32 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          rows={1}
        />
      </div>
      <Button
        type="submit"
        disabled={isDisabled}
        className="flex-shrink-0 px-3 py-2 h-11"
        title="Send message (Enter)"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </Button>
    </form>
  )
}

export default MessageForm