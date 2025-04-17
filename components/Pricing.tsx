import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { pricingPlans } from '@/public/data'

export default function Pricing() {
  return (
    <section className="py-20 font-base lg:py-[100px] bg-bg dark:bg-brand-dark border-t-2 border-border dark:border-darkBorder">
      <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
        🚀 Choose the Perfect Plan for You
      </h2>
      <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <PricingPlan key={index} {...plan} />
        ))}
      </div>
    </section>
  )
}

function PricingPlan({ perks, mostPopular = false, planName, description, price }) {
  return (
    <div id='pricing' className="border-border dark:border-darkBorder dark:bg-brand-dark flex flex-col justify-between rounded-base border-2 bg-white p-5">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading">{planName}</h3>
          {mostPopular && (
            <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-brand-glow px-2 py-0.5 text-sm">
              Most popular
            </span>
          )}
        </div>
        <p className="mb-3 mt-1">{description}</p>
        <div>
          <span className="text-3xl font-heading">${price}</span> <span>/month</span>
        </div>
        <ul className="mt-8 flex flex-col gap-2">
          {perks.map((perk, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="shrink-0" size={20} /> {perk}
            </li>
          ))}
        </ul>
      </div>
      <Button
        size={mostPopular ? 'lg' : 'default'}
        className={cn('mt-12 w-full', mostPopular && 'bg-black text-white')}
      >
        Buy Plan
      </Button>
    </div>
  )
}
