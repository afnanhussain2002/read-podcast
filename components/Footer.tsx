const Footer = () => {
    return (
      <footer className="bg-main border-t-4 border-black p-8 text-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo / About */}
          <div>
            <h1 className="text-2xl font-bold">Scribint ✍️</h1>
            <p className="mt-2 font-medium">
              Where your thoughts turn into stories. Built with creativity, designed with freedom.
            </p>
          </div>
  
          {/* Links */}
          <div>
            <h2 className="text-xl font-bold mb-2">Links</h2>
            <ul className="space-y-1">
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="/blog" className="hover:underline">Blog</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
  
          {/* Socials */}
          <div>
            <h2 className="text-xl font-bold mb-2">Follow Us</h2>
            <ul className="space-y-1">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></li>
            </ul>
          </div>
        </div>
  
        {/* Bottom bar */}
        <div className="border-t-4 border-black mt-8 pt-4 text-center font-bold">
          © {new Date().getFullYear()} Scribint — All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  