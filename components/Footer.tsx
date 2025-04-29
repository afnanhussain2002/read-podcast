import Link from "next/link";
import Logo from "./Logo";

const Footer = () => {
    return (
      <footer className="bg-brand-light dark:bg-brand-glow border-t-4 border-black p-8 text-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo / About */}
          <div>
           <div className="mb-2">
            <Logo/>
           </div>
            <p className="mt-2 font-medium">
              Where your thoughts turn into stories. Built with creativity, designed with freedom.
            </p>
          </div>
  
          {/* Links */}
         {/*  <div>
            <h2 className="text-xl font-bold mb-2">Links</h2>
            <ul className="space-y-1">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div> */}
  
          {/* Socials */}
          <div>
            <h2 className="text-xl font-bold mb-2">Follow Us</h2>
            <ul className="space-y-1">
              <li><Link href="https://www.linkedin.com/company/vido-note/" target="_blank" rel="noopener noreferrer" className="hover:underline">Linkedin</Link></li>
              <li><Link href="https://www.instagram.com/vidonote/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</Link></li>
              <li><Link href="https://www.tiktok.com/@vido.note" target="_blank" rel="noopener noreferrer" className="hover:underline">TikTok</Link></li>
            </ul>
          </div>
        </div>
  
        {/* Bottom bar */}
        <div className="border-t-4 border-black mt-8 pt-4 text-center font-bold">
          © {new Date().getFullYear()} Vido Note — All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  