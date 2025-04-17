'use client';

import { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { MdDashboard } from "react-icons/md";
import { GrDocumentNotes } from "react-icons/gr";
import { RiProfileLine } from "react-icons/ri";
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <button
        className="fixed top-5 left-4 z-50 text-white text-3xl bg-black border-[3px] border-white rounded-lg px-2 py-1"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-brand-surface text-white w-[280px] border-r-[5px] border-white p-4 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? '' : '-translate-x-full'
        }`}
      >
        <div className="text-xl font-extrabold mb-4">🧱 Scribint</div>

        <Link href="/dashboard" ><Button size={"lg"} variant={"neutral"}className='w-full bg-white'> <MdDashboard/> Dashboard</Button></Link>
        <Link href="/dashboard/all-transcribe" ><Button size={"lg"} variant={"neutral"}className='w-full bg-white mt-4'> <GrDocumentNotes/> All Transcribe</Button></Link>
        <Link href="/dashboard/profile" ><Button size={"lg"} variant={"neutral"}className='w-full bg-white mt-4'> <RiProfileLine/> Profile</Button></Link>

        <Button size={"lg"} className="mt-auto bg-brand-dark  border-brand-dark font-bold" onClick={() => signOut()}> <BiLogOut /> Logout</Button>
      </aside>
    </>
  );
};



export default Sidebar;
