"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function PricingPlan({
  perks,
  mostPopular = false,
  planName,
  description,
  price,
  minutes,

}: {
  perks: string[];
  mostPopular?: boolean;
  planName: string;
  description: string;
  price: number;
  minutes: number;

}) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession()
  const router = useRouter();
  const user = session?.user

  const handleBuy = async () => {
    if (!user) {
      router.push("/login");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ minutes, email:user?.email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="pricing"
      className={cn(
        "border-border dark:border-darkBorder dark:bg-brand-dark flex flex-col justify-between rounded-base border-2 bg-white p-5 shadow-light dark:shadow-dark",
        mostPopular && "border-black"
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading">{planName}</h3>
          {mostPopular && (
            <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-brand-glow px-2 py-0.5 text-sm">
              Most popular
            </span>
          )}
        </div>
        <p className="mb-3 mt-1 text-muted-foreground">{description}</p>
        <div className="mt-1 text-3xl font-heading">{price}</div>
        <ul className="mt-6 flex flex-col gap-2 text-sm">
          {perks.map((perk, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="shrink-0 text-green-600" size={20} /> {perk}
            </li>
          ))}
        </ul>
      </div>
      <Button
        size={mostPopular ? "lg" : "default"}
        className={cn("mt-10 w-full", mostPopular && "bg-black text-white hover:bg-black/90")}
        onClick={handleBuy}
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Buy Minutes"}
      </Button>
    </div>
  );
}
