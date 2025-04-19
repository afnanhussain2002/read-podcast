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
    let customerId = existingCustomer.data.length > 0 ? existingCustomer.data[0]?.id : null;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email,
        })
        customerId = customer.id;
    }

    const {url} = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            }
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3000/account',
        cancel_url: 'http://localhost:3000/account'
    })
    return url;
   } catch (error) {
    
   }
}