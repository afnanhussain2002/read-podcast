// app/dashboard/layout.tsx
import Sidebar from '@/components/Sidebar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[0px] p-6 w-full dark:bg-secondaryBlack min-h-screen border-l-[5px] border-black lg:ml-[280px]">
        {children}
      </main>
    </div>
  );
}
