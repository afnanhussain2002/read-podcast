'use client';

import { useState } from 'react';
import { BiSearch, BiHomeAlt, BiBookmark, BiChat, BiLogOut } from 'react-icons/bi';
import { BsChevronDown } from 'react-icons/bs';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
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

        <NavItem icon={<BiHomeAlt />} label="Home" />
        <NavItem icon={<BiBookmark />} label="Bookmark" />

        {submenuOpen && (
          <div className="mt-2 ml-6 flex flex-col gap-2">
            <SubItem label="Social" />
            <SubItem label="Personal" />
            <SubItem label="Friends" />
          </div>
        )}

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

const SubItem = ({ label }: { label: string }) => (
  <div className="cursor-pointer bg-blue-300 border-[3px] border-black px-3 py-1 rounded-lg hover:bg-blue-400 font-bold text-black">
    {label}
  </div>
);

export default Sidebar;
