import { features } from '@/public/data'
import Marquee from 'react-fast-marquee'

export default function Features() {


  return (
    <div>
      <section className="border-t-border dark:border-t-darkBorder dark:bg-brand-dark border-t-2 bg-brand-light py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          ✨ Features That Make Vido Note Magical
        </h2>

        <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            return (
              <div
                className="border-border dark:border-darkBorder dark:bg-brand-dark shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-brand-light p-5"
                key={i}
              >
                <h4 className="text-xl font-heading">{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <div>
        <Marquee
          className="border-y-border dark:border-y-darkBorder dark:border-darkBorder dark:bg-brand-dark border-y-2 bg-white py-3 font-base sm:py-5"
          direction="left"
        >
          {[
            'AI-Powered Transcription',
            'Speaker Detection',
            'Multilingual Support',
            'Podcast Summaries',
            'Information Recognition',
            'Chapters of Podcast',
          ].map((text, id) => {
            return (
              <div className="flex items-center" key={id}>
                <span className="mx-8 text-xl font-heading sm:text-2xl lg:text-4xl">
                  {text}
                </span>
              </div>
            )
          })}
        </Marquee>
      </div>
    </div>
  )
}
