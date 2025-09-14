import { NextAuthOptions } from 'next-auth'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Temporarily disabled for credentials auth
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-demo',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo',
    }),
    // Demo credentials provider for development
    CredentialsProvider({
      id: 'demo',
      name: 'Demo Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        console.log('🔐 Demo login attempt for:', credentials?.email)
        
        if (!credentials?.email) {
          console.log('❌ No email provided')
          return null
        }

        // Simple hardcoded validation for demo
        const demoUsers = {
          'admin@example.com': { id: '1', name: 'Admin User', email: 'admin@example.com', isAdmin: true },
          'john@example.com': { id: '2', name: 'John Doe', email: 'john@example.com', isAdmin: false },
          'sarah@example.com': { id: '3', name: 'Sarah Wilson', email: 'sarah@example.com', isAdmin: false },
          'mike@example.com': { id: '4', name: 'Mike Chen', email: 'mike@example.com', isAdmin: false },
          'emily@example.com': { id: '5', name: 'Emily Rodriguez', email: 'emily@example.com', isAdmin: false },
          'david@example.com': { id: '6', name: 'David Kim', email: 'david@example.com', isAdmin: false },
        }

        const user = demoUsers[credentials.email as keyof typeof demoUsers]
        
        if (user) {
          console.log('✅ Demo user found:', user.name, user.email)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: null,
          }
        } else {
          console.log('❌ Email not in demo list:', credentials.email)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code: any, metadata?: any) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code: any) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code: any, metadata?: any) {
      console.log('NextAuth Debug:', code, metadata)
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        
        // Fetch user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isAdmin: true,
            isSuspended: true,
            rating: true,
          }
        })

        if (dbUser) {
          session.user = {
            ...session.user,
            ...dbUser,
          }
        }
      }
      return session
    },
  },
}