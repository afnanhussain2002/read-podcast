import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function PricingPlan({ perks, mostPopular = false, planName, description, price }) {
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
        <div className="mt-1 text-3xl font-heading">
          {price === "Free" ? (
            <span>Free</span>
          ) : (
            <>
              <span>${price}</span>
              <span className="text-base font-normal text-muted-foreground"> /month</span>
            </>
          )}
        </div>
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
      >
        {price === "Free" ? "Try for Free" : "Buy Plan"}
      </Button>
    </div>
  );
}
