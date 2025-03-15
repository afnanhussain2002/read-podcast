
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
           name: "Credentials",
           credentials: {
               email: { label: "Email", type: "email" },
               password: { label: "Password", type: "password" },
           },
          async authorize(credentials) {
               if (!credentials?.email || !credentials.password) {
                throw new Error("Please provide an email and password");
               }

               try {
                await connectToDatabase();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("User not found");
                }
               } catch (error) {
                
               }
           },
        })
    ],
}