'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { TopNav } from '@/components/layout/top-nav';

/**
 * AppContent redesenhado para refletir a UX moderna do site NextCon.
 */
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

  if (!mounted || (isUserLoading && !isLoginPage)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#090e24] animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-[#00b4ff]/30 animate-pulse rounded-full" />
          <Loader2 className="h-16 w-16 animate-spin text-[#00b4ff] relative z-10" />
        </div>
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="text-[11px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Sincronizando NAI Cloud</p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen w-full bg-white animate-in fade-in duration-500">{children}</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 overflow-x-hidden selection:bg-accent selection:text-primary">
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 transition-all duration-500">
        {children}
      </main>
      <footer className="py-10 border-t bg-white text-primary/30 text-center">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 NextCon SAÚDE EMPRESARIAL
          </p>
          <div className="flex gap-6">
            <span className="text-[9px] font-bold uppercase tracking-widest">SST Intelligence</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">NAI v2.6</span>
          </div>
        </div>
      </footer>
    </div>
  );
}