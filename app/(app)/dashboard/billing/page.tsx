import { subscribe } from '@/actions/stripe.action';
import { useSession } from 'next-auth/react';
import React from 'react'

const BillingPage = () => {
    const { data: session } = useSession();

    const handleSubscribe = async () => {
        if (session?.user) {
            throw new Error("User not found");
        }

        const url = await subscribe({
            
        })
    }


  return (
    <div>BillingPage</div>
  )
}

export default BillingPage