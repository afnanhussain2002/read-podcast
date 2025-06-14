
import TranscribeInput from "@/components/TranscribeInput";

export default function Transcriber() {

  return (
    <>
     <section className="dark:bg-brand-dark inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
    <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px]">
      <h1 className="text-3xl font-heading md:text-4xl lg:text-5xl">
      ✨ Upload The Audio File
      </h1>
      <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
       
      Copy youtube video link, go to <span className="underline text-brand-glow"><a href="https://ezmp3.io/h520/" target="_blank">ezmp3.io</a></span>, convert the video into audio, Upload it here.
      </p>

      <TranscribeInput/>
      
    </div>
  </section>  
    
    </>
  );
}