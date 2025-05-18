import type { NextAuthConfig, User } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
import "next-auth/jwt";
// import type { Session } from "next-auth";
import GitHub from "next-auth/providers/github";
import { decodeJwt } from "jose";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expires?: number;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expires?: Date;
  }
}

interface UserWithToken extends User {
  token: {
    access: string;
    refresh: string;
  };
  name: string;
  message?: string;
}

export default {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const userWithToken = user as UserWithToken;
      if (userWithToken?.message === "Activation link sent to your email") {
        throw new Error("Activation link sent to your email");
      }
      if (account?.provider !== "credentials") {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/userauth/users/social_login/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: account?.provider,
              providerId: account?.id,
              email: user.email,
              username: user.name,
              profile: profile || user.image,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to process social login with Django",
          );
        }

        const data = await response.json();
        if (data.token) {
          userWithToken.token = {
            access: data.token.access,
            refresh: data.token.refresh,
          };
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user && "token" in user) {
        const userWithToken = user as UserWithToken;
        token.accessToken = userWithToken.token.access;
        token.refreshToken = userWithToken.token.refresh;
        const decoded = decodeJwt(userWithToken.token.access);
        token.expires = decoded.exp as number;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      if (token.expires) {
        session.expires = new Date(token.expires * 1000);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
