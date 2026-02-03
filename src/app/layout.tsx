
"use client"

import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se não estiver logado e não for a página de login, não renderiza o conteúdo principal (aguarda redirect)
  if (!user && pathname !== '/login') {
    return null;
  }

  // Se for a página de login, renderiza apenas o children (sem sidebar)
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-svh overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background p-6 md:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
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
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>NextCon SST - Gestão Ocupacional</title>
      </head>
      <body className="font-body antialiased min-h-svh">
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
