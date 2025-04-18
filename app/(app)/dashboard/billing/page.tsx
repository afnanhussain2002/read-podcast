"use client";
import { subscribe } from "@/actions/stripe.action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const BillingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;

  const handleSubscribe = async () => {
    if (!user) {
      throw new Error("User not found");
    }

    const url = await subscribe({
      userId: user?.id as string,
      email: user?.email as string,
      priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID!,
    });

    console.log(url);

    if (url) {
      router.push(url);
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
};

export default BillingPage;
