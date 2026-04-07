import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// For serverless environments
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        name: { label: "Name", type: "text", placeholder: "Your Name" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const name = credentials.name?.trim() || email.split('@')[0];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return null;
        }

        return {
          id: email,
          email: email,
          name: name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string || "";
        session.user.email = token.email as string || "";
        session.user.name = token.name as string || "";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || "";
        token.email = user.email || "";
        token.name = user.name || "";
      }
      return token;
    },
    async redirect({ url }) {
      const siteBaseUrl = getBaseUrl();
      if (url.startsWith("/")) return `${siteBaseUrl}${url}`;
      return siteBaseUrl;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "aurnik-secret-key-for-development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
