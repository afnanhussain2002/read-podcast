'use client';

import { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { MdDashboard } from "react-icons/md";
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <button
        className="fixed top-5 left-4 z-50 text-white text-3xl bg-black border-[3px] border-white rounded-lg px-2 py-1 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-main text-white w-[280px] border-r-[5px] border-white p-4 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? '' : '-translate-x-full'
        }`}
      >
        <div className="text-xl font-extrabold mb-4">🧱 Scribint</div>

        <Link href="/dashboard" ><Button size={"lg"} variant={"neutral"}className='w-full bg-white'> <MdDashboard/> Dashboard</Button></Link>

        <Button size={"lg"} className="mt-auto bg-secondaryBlack  border-secondaryBlack font-bold" onClick={() => signOut()}> <BiLogOut /> Logout</Button>
      </aside>
    </>
  );
};

const NavItem = ({ icon, label, className = '' }: { icon: React.ReactNode; label: string; className?: string }) => (
  <div
    className={`flex items-center gap-3 cursor-pointer bg-yellow-300 text-black border-[3px] border-black px-4 py-2 rounded-lg mb-2 hover:bg-yellow-400 font-bold ${className}`}
  >
    {icon}
    <span>{label}</span>
  </div>
);


export default Sidebar;
