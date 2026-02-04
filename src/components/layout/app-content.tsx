
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { TopNav } from '@/components/layout/top-nav';

/**
 * Componente Cliente que gerencia o estado de autenticação e o layout principal.
 * Separado do RootLayout para evitar erros de hidratação.
 */
export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  // Garante que o componente só renderize conteúdo dinâmico após a montagem no cliente
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Redirecionamento para login se não estiver autenticado
  React.useEffect(() => {
    if (mounted && !isUserLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isUserLoading, pathname, router, mounted]);

  // Tela de carregamento inicial
  if (!mounted || isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#090e24]">
        <Loader2 className="h-8 w-8 animate-spin text-[#f59e0b]" />
      </div>
    );
  }

  // Layout simplificado para página de login
  if (pathname === '/login') {
    return <div className="min-h-screen w-full bg-white">{children}</div>;
  }

  // Se não houver usuário após o carregamento (e não for página de login), não renderiza nada (redirecionamento em curso)
  if (!user && pathname !== '/login') return null;

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
