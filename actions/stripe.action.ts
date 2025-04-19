"use server";

import { stripe } from "@/lib/stripe";

type Props = {
    userId: string;
    email: string;
    priceId: string;
    
};

export const subscribe = async ({ userId, email, priceId }: Props) => {
   if (!userId || !email || !priceId) {
    throw new Error("Missing required fields");
   }

   try {
    const existingCustomer = await stripe.customers.list({
        email: email,
        limit: 1,
    })
   } catch (error) {
    
   }
}