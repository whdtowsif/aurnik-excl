import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// For serverless environments like Netlify
const getBaseUrl = () => {
  // Priority: NEXTAUTH_URL env var, then VERCEL_URL, then default
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NETLIFY_URL) return `https://${process.env.NETLIFY_URL}`;
  return "http://localhost:3000";
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid email profile"
        }
      }
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        name: { label: "Name", type: "text", placeholder: "Your Name" },
      },
      async authorize(credentials) {
        // Validate email
        if (!credentials?.email) {
          console.log("No email provided");
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const name = credentials.name?.trim() || email.split('@')[0];

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          console.log("Invalid email format:", email);
          return null;
        }

        // Return user object - this creates the session
        console.log("Authorizing user:", email);
        return {
          id: email,
          email: email,
          name: name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", { 
        provider: account?.provider, 
        email: user.email,
        name: user.name 
      });
      return true;
    },
    async session({ session, token, user }) {
      // For JWT strategy, get data from token
      if (session.user) {
        if (token) {
          session.user.id = token.id as string || token.sub || "";
          session.user.email = token.email as string || session.user.email;
          session.user.name = token.name as string || session.user.name;
        }
      }
      console.log("Session callback:", session.user);
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id || "";
        token.email = user.email || undefined;
        token.name = user.name || undefined;
      }
      console.log("JWT callback:", { id: token.id, email: token.email });
      return token;
    },
    async redirect({ url, baseUrl }) {
      const siteBaseUrl = getBaseUrl();
      console.log("Redirect callback - URL:", url, "baseUrl:", baseUrl, "siteBaseUrl:", siteBaseUrl);
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${siteBaseUrl}${url}`;
      
      // Allows callback URLs on the same origin or configured origin
      try {
        const callbackUrl = new URL(url);
        const configuredUrl = new URL(siteBaseUrl);
        if (callbackUrl.origin === configuredUrl.origin) return url;
      } catch (e) {
        console.log("Error parsing URL:", e);
      }
      
      return siteBaseUrl;
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
  secret: process.env.NEXTAUTH_SECRET || "aurnik-secret-key-for-development",
  debug: process.env.NODE_ENV === "development",
  // Use secure cookies in production
  cookies: process.env.NODE_ENV === "production" ? {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  } : undefined,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
