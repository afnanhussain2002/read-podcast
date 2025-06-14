import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'



const Hero = () => {
  return (
    <>
    
    <header className="dark:bg-brand-dark inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center bg-brand-light bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
    <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px]">
      <h1 className="text-3xl font-heading md:text-4xl lg:text-5xl">
      📝 From Sound to Script—Effortlessly!
      </h1>
      <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
       
      Drop a audio file, and Vido Note will turn it into a transcript with AI-powered speaker detection. Video file, YouTube video Link support coming soon
      </p>
      <Link
      href={'/transcriber'}
      >
      <Button
        size="lg"
        className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl mt-12"
      >
        Try Vido Note Today!
      </Button>
      
      </Link>
      
    </div>
  </header>
    
    </>
  )
}

export default Hero