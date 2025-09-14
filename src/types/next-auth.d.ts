import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isAdmin?: boolean
      isActive?: boolean
      rating?: number
    } & DefaultSession['user']
  }

  interface User {
    id: string
    isAdmin?: boolean
    isActive?: boolean
    rating?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isAdmin?: boolean
    isActive?: boolean
  }
}