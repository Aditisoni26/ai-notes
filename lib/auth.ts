import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials) return null

        const user = await db.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          name: user.username
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
    }
    return token
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string
    }
    return session
  }
}
}