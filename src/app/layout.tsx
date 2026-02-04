
"use client"

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

  React.useEffect(() => {
    if (mounted && !isUserLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isUserLoading, pathname, router, mounted]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-[#090e24] text-white">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (pathname === '/login') {
    return <div className="min-h-svh w-full bg-background">{children}</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <TopNav />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      <footer className="py-6 border-t bg-muted/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase font-black tracking-widest">
          <p>© 2024 NEXTCON SAÚDE EMPRESARIAL</p>
          <div className="flex gap-4">
            <span className="text-primary/40">Suporte Técnico</span>
            <span className="text-primary/40">Privacidade</span>
          </div>
        </div>
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
    <html lang="pt-BR" suppressHydrationWarning className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>NextCon SST - Gestão Ocupacional</title>
      </head>
      <body className="font-body antialiased min-h-svh bg-background text-foreground">
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
