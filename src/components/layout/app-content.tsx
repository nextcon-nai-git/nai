'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { TopNav } from '@/components/layout/top-nav';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#003366]">
        <Loader2 className="h-12 w-12 animate-spin text-white opacity-20" />
        <p className="mt-4 text-xs font-bold text-white/40 uppercase tracking-widest">NextCon Cloud Engine</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen w-full bg-white">{children}</div>;
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}