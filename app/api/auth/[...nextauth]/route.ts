import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {}
      },

      async authorize(credentials) {
        // 🔴 HARD VALIDATION (don’t skip this)
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // ✅ RETURN FULL USER
        return {
          id: user.id,
          name: user.username,
          email: user.email
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // 🔥 FIRST LOGIN
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // 🔥 ATTACH TO SESSION
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/login" // optional but cleaner UX
  },

  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };