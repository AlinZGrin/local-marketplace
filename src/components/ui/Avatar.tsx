import React from 'react'
import { getInitials } from '@/utils/helpers'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  }

  const initials = getInitials(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          ${sizes[size]} 
          rounded-full object-cover ring-2 ring-gray-200
          ${className}
        `}
      />
    )
  }

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full bg-gradient-to-br from-blue-500 to-purple-600
        flex items-center justify-center text-white font-semibold
        ring-2 ring-gray-200
        ${className}
      `}
    >
      {initials}
    </div>
  )
}