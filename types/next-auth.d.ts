import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    picture?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  }
}


