import { subscribe } from '@/actions/stripe.action';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

const BillingPage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const user = session?.user

    const handleSubscribe = async () => {
        if (session?.user) {
            throw new Error("User not found");
        }

        const url = await subscribe({
            userId: user?.id as string,
            email: user?.email as string,
            priceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID as string
        })

        if (url) {
           
        }
    }


  return (
    <div>BillingPage</div>
  )
}

export default BillingPage