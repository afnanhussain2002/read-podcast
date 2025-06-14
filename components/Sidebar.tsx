'use client';

import { useState, useEffect } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { MdDashboard } from "react-icons/md";
import { GrDocumentNotes } from "react-icons/gr";
import { RiProfileLine } from "react-icons/ri";
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Logo from './Logo';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // default: closed on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg = 1024px
    };

    handleResize(); // set initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(prev => !prev);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="fixed top-5 left-4 z-50 text-brand-dark text-xl bg-brand-glow border-[3px] rounded-lg px-2 py-1 lg:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-brand-glow dark:bg-brand-surface text-white w-[280px] border-r-[5px] p-4 flex flex-col transition-transform duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? '' : '-translate-x-full') : ''}
        `}
      >
        <div className='mb-10'>
          <Logo />
        </div>

        <Link href="/dashboard">
          <Button size="lg" variant="neutral" className="w-full bg-brand-light dark:bg-brand-dark border-none text-brand-glow shadow-light dark:shadow-dark">
            <MdDashboard /> Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/all-transcribe">
          <Button size="lg" variant="neutral" className="w-full bg-brand-light dark:bg-brand-dark mt-4 border-none text-brand-glow shadow-light dark:shadow-dark">
            <GrDocumentNotes /> All Transcribe
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button size="lg" variant="neutral" className="w-full bg-brand-light dark:bg-brand-dark mt-4 border-none text-brand-glow shadow-light dark:shadow-dark">
            <RiProfileLine /> Profile
          </Button>
        </Link>

        <Button
          size="lg"
          className="mt-auto bg-brand-light dark:bg-brand-glow font-bold text-brand-dark border-none"
          onClick={() => signOut()}
        >
          <BiLogOut /> Logout
        </Button>
      </aside>
    </>
  );
};

export default Sidebar;
