import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username }
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                //const isPasswordValid = true; // 🚨 마스터 강제 프리패스 발동!

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    name: user.name,
                    username: user.username,
                    role: user.role
                } as any;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).username = token.username;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour (auto logout server side constraint)
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
