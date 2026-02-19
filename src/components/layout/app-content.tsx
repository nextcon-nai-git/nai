
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { TopNav } from '@/components/layout/top-nav';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { NaiFloatingWidget } from '@/components/commercial/nai-floating-widget';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  const isLoginPage = React.useMemo(() => pathname === '/login', [pathname]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && !isUserLoading && !user && !isLoginPage) {
      router.replace('/login');
    }
  }, [user, isUserLoading, isLoginPage, router, mounted]);

  // Splash Screen Global - Centralizado com Balão "N"
  if (!mounted || (isUserLoading && !isLoginPage)) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-primary z-[9999] overflow-hidden">
        {/* Efeito de brilho ao fundo */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)]" />
        </div>

        {/* O Balão N (Estilo NextCon) */}
        <div className="relative animate-in zoom-in duration-500">
          <div className="size-24 rounded-[2.5rem] bg-[#090e24] flex items-center justify-center text-white font-black text-5xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-bounce border-2 border-white/10">
            N
          </div>
          <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full -z-10 animate-pulse" />
        </div>

        {/* Texto de Status */}
        <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <span className="text-xs font-black text-white/60 uppercase tracking-[0.4em]">NextCon Intelligence</span>
          </div>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Iniciando Protocolos 2026...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen w-full bg-white">{children}</div>;
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden relative">
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
        
        {/* Widget Flutuante da NAI */}
        <NaiFloatingWidget />
      </div>
    </SidebarProvider>
  );
}
