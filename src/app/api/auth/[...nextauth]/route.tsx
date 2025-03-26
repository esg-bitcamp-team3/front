import { login } from "@/lib/api/auth";
import { LoginForm } from "@/lib/api/interfaces/auth";
import { access } from "fs";
import { decodeJwt } from "jose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const response = await login(credentials as LoginForm);
        if (response.ok) {
          return decodeJwt(response.body);
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
