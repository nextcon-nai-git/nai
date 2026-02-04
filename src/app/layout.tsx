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

  // Garante que o componente só renderize no cliente após a hidratação
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
      <div className="flex h-screen w-full items-center justify-center bg-[#090e24]">
        <Loader2 className="h-8 w-8 animate-spin text-[#f59e0b]" />
      </div>
    );
  }

  // Se estiver na tela de login, não mostra o menu
  if (pathname === '/login') {
    return <div className="min-h-screen w-full bg-white">{children}</div>;
  }

  // Se não houver usuário e não estiver carregando, redireciona (acima), 
  // mas evita flash de conteúdo
  if (!user && pathname !== '/login') return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
      <footer className="py-6 border-t bg-[#090e24] text-white/40 text-center text-[10px] font-bold tracking-widest uppercase">
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
      <body>
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}