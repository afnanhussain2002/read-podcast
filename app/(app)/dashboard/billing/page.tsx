import { useSession } from 'next-auth/react';
import React from 'react'

const BillingPage = () => {
    const { data: session } = useSession();
  return (
    <div>BillingPage</div>
  )
}

export default BillingPage