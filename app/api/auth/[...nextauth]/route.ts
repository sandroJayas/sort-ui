import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // or wherever you keep your config

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
