
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { TopNav } from '@/components/layout/top-nav';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle protected route redirection
  React.useEffect(() => {
    if (mounted && !isUserLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isUserLoading, pathname, router, mounted]);

  // Initial loading state or server-side rendering wait
  if (!mounted || isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#090e24]">
        <Loader2 className="h-8 w-8 animate-spin text-[#f59e0b]" />
      </div>
    );
  }

  // Login page has its own minimal layout
  if (pathname === '/login') {
    return <div className="min-h-screen w-full bg-white">{children}</div>;
  }

  // Prevent flash of content if not logged in
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="py-6 border-t bg-[#090e24] text-white/40 text-center text-[10px] font-bold tracking-widest uppercase mt-auto">
        © 2024 NEXTCON SAÚDE EMPRESARIAL - SISTEMA DE GESTÃO SST
      </footer>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" />
        <title>NextCon - SST Intelligence</title>
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
