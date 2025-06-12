import CredentialsProvider from "next-auth/providers/credentials"
import {NextAuthOptions} from "next-auth";
import { connectDB } from "./connectdb";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
   providers: [
    CredentialsProvider({
        name: "Sign in with Email",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "Enter your email"},
            password: { label: "Password", type: "password", placeholder: "Enter your password" }
        },
        async authorize(credentials) {
            const { email, password } = credentials || {};
            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            try {
                await connectDB(); // Ensure the database is connected
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error("User not found with this email");
                }
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    throw new Error("Invalid password");
                }
                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role
                };
            } catch (error: any) {
                console.error("Error during authorization:", error.message);
                throw new Error("Authorization failed");
            }
        }
    })
   ],
   callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin"
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60  // 30 days
    }
}