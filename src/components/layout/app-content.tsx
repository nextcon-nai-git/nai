'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { TopNav } from '@/components/layout/top-nav';

/**
 * Componente Cliente otimizado para evitar re-renders desnecessários e flashes de conteúdo.
 */
export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  // Memoiza a verificação de página de login para evitar cálculos em cada render
  const isLoginPage = React.useMemo(() => pathname === '/login', [pathname]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Redirecionamento centralizado
  React.useEffect(() => {
    if (mounted && !isUserLoading && !user && !isLoginPage) {
      router.replace('/login');
    }
  }, [user, isUserLoading, isLoginPage, router, mounted]);

  // Loading state com transição suave
  if (!mounted || (isUserLoading && !isLoginPage)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#090e24] animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-[#f59e0b]/20 animate-pulse rounded-full" />
          <Loader2 className="h-12 w-12 animate-spin text-[#f59e0b] relative z-10" />
        </div>
        <p className="mt-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] animate-pulse">Sincronizando NAI Cloud...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen w-full bg-white animate-in fade-in duration-300">{children}</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 transition-all duration-300">
        {children}
      </main>
      <footer className="py-6 border-t bg-[#090e24] text-white/40 text-center text-[10px] font-bold tracking-widest uppercase mt-auto">
        © 2026 NextCon SAÚDE EMPRESARIAL - SISTEMA DE GESTÃO SST
      </footer>
    </div>
  );
}
