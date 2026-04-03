import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        name: { label: "Name", type: "text", placeholder: "Your Name" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Check if subscriber exists
        let subscriber = await db.subscriber.findUnique({
          where: { email: credentials.email },
        });

        if (!subscriber) {
          // Create new subscriber
          subscriber = await db.subscriber.create({
            data: {
              email: credentials.email,
              name: credentials.name || null,
              source: "credentials",
              isActive: true,
            },
          });
        } else if (!subscriber.isActive) {
          // Reactivate
          subscriber = await db.subscriber.update({
            where: { email: credentials.email },
            data: { isActive: true, name: credentials.name || subscriber.name },
          });
        }

        return {
          id: subscriber.id,
          email: subscriber.email,
          name: subscriber.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Auto-subscribe Google users
          const existing = await db.subscriber.findUnique({
            where: { email: user.email },
          });

          if (!existing) {
            await db.subscriber.create({
              data: {
                email: user.email,
                name: user.name || null,
                source: "google",
                isActive: true,
              },
            });
          } else if (!existing.isActive) {
            await db.subscriber.update({
              where: { email: user.email },
              data: { isActive: true },
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return true; // Still allow sign in
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // Fetch subscriber data
        const subscriber = await db.subscriber.findUnique({
          where: { email: session.user.email },
        });
        if (subscriber) {
          session.user.id = subscriber.id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "aurnik-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
