import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:8000";

const normalizeAuthResponse = (response: any) => {
  const payload = response?.data?.data ?? {};
  const rootTokens = response?.data?.tokens;
  console.log("test");
  const rawUser = typeof payload?.user === "object" ? payload.user : payload;

  let embeddedTokens;
  let normalizedUser = rawUser;

  if (rawUser && typeof rawUser === "object" && !Array.isArray(rawUser)) {
    const { tokens, ...rest } = rawUser as Record<string, any>;
    embeddedTokens = tokens;
    normalizedUser = rest;
  }

  const tokens = rootTokens ?? payload?.tokens ?? embeddedTokens;

  return {
    user: normalizedUser ?? null,
    tokens: tokens ?? null,
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider for Email/Password login
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const isGoogleLogin =
            credentials?.username === "google_oauth" &&
            Boolean(credentials?.password);

          console.log({ isGoogleLogin });

          const requestConfig = {
            headers: {
              "Content-Type": "application/json",
            },
          };

          let response;

          if (isGoogleLogin) {
            response = await axios.post(
              `${API_URL}/auth/social/google/callback`,
              {
                token: credentials?.password,
              },
              requestConfig
            );
          } else {
            response = await axios.post(
              `${API_URL}/auth/signin-gateway`,
              {
                username: credentials?.username,
                password: credentials?.password,
              },
              requestConfig
            );
          }

          console.log({ isGoogleLogin, response });

          if (response?.data?.success && response.data?.data) {
            const { user: normalizedUser, tokens } =
              normalizeAuthResponse(response);

            if (!normalizedUser?.id) {
              return null;
            }

            return {
              id: normalizedUser.id,
              email: normalizedUser.email,
              name:
                normalizedUser.display_name ||
                normalizedUser.first_name ||
                normalizedUser.email,
              image: normalizedUser.profile_picture || normalizedUser.photo,
              accessToken: tokens?.access_token,
              refreshToken: tokens?.refresh_token,
              tokenType: tokens?.type,
              user: normalizedUser,
            };
          }

          return null;
        } catch (error: any) {
          console.error(
            "Login error:",
            error,
            error.response?.data || error.message
          );
          throw new Error(
            error.response?.data?.message || "Invalid credentials"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in - store tokens SERVER-SIDE ONLY
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.accessToken = (user as any).accessToken; // Server-side only
        token.refreshToken = (user as any).refreshToken; // Server-side only
        token.tokenType = (user as any).tokenType;
        token.user = (user as any).user;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        // Only expose user data to client, NOT tokens
        session.user = (token.user as any) ?? session.user;
        // DO NOT expose: accessToken, refreshToken
        console.log("✅ Session created for user:", session.user?.email);
      } else {
        console.log("⚠️ No token found in session callback");
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // console.log("🔄 NextAuth Redirect:", { url, baseUrl });

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log("✅ Redirecting to:", redirectUrl);
        return redirectUrl;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        console.log("✅ Redirecting to same origin:", url);
        return url;
      }

      console.log("⚠️ Fallback redirect to baseUrl:", baseUrl);
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // Remove custom cookie config - let NextAuth handle it automatically
  // This prevents cookie domain/naming issues

  secret:
    process.env.NEXTAUTH_SECRET || "your-secret-key-change-this-in-production",

  debug: process.env.NODE_ENV === "development",
};
