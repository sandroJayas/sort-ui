import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      accountType?: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    token: string;
    account_type?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    accountType?: string;
    accessToken: string;
  }
}
