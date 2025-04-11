import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profileImage?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    profileImage?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    profileImage?: string;
  }
}
