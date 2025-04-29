import type { Metadata } from 'next';
import {Poppins } from 'next/font/google';
import './globals.css';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { ThemeProvider } from '@/providers/theme-provider';
import { NotificationProvider } from '@/components/Notification';
import LayoutWrapper from '@/components/LayoutWrapper'; // ✅ import it here
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/providers/AuthProvider';

const poppinsSans = Poppins({
  variable: '--font-poppins-sans',
  subsets: ['latin'],
  weight: '100'
});


export const metadata: Metadata = {
  title: 'Vido Note',
  description: 'Transcribe any podcast video',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsSans.variable} antialiased`}>
        <AuthProvider>
        <NotificationProvider>
        <Toaster richColors position="bottom-right" />
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <LayoutWrapper>

              {children}
            </LayoutWrapper>
            <ThemeSwitcher />
          </ThemeProvider>
        </NotificationProvider>

        </AuthProvider>
      </body>
    </html>
  );
}
