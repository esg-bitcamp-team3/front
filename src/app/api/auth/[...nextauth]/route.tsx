import {login} from '@/lib/api/auth'
import {LoginForm} from '@/lib/api/interfaces/auth'
import {access} from 'fs'
import {decodeJwt} from 'jose'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {label: 'username', type: 'text'},
        password: {label: 'password', type: 'password'}
      },
      async authorize(credentials, req): Promise<any> {
        try {
          const res = await fetch(`http://localhost:4000/auth/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password
            })
          })

          const user = await res.json()
          return user || null
        } catch (e) {
          throw new Error()
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({session, token, user}) {
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
})

// export {handler as GET, handler as POST}
export {handler as GET, handler as POST}
