
import { pricingPlans } from '@/public/data'
import PricingPlan from './PricingPlan'

export default function Pricing() {
  return (
    <section className="py-20 font-base lg:py-[100px] bg-brand-light dark:bg-brand-dark border-t-2 border-border dark:border-darkBorder">
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


