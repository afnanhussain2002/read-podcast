'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Add all routes where you want to hide the header & footer
  const hideLayout =
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forget-password' ||
    pathname === '/reset-password';

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
