// app/dashboard/layout.tsx
import Sidebar from '@/components/Sidebar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[0px] p-6 w-full bg-brand-light dark:bg-brand-dark min-h-screen border-l-[5px] border-brand-dark dark:border-brand-glow lg:ml-[280px]">
        {children}
      </main>
    </div>
  );
}
