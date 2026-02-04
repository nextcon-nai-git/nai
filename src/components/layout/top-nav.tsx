'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Stethoscope, 
  SearchCheck, 
  LogOut,
  Database,
  Lock,
  Sparkles,
  TrendingUp,
  Activity,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { NextconLogo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

export function TopNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'Equipe', href: '/employees', icon: Users },
    { title: 'PGR', href: '/risk-management', icon: ShieldAlert },
    { title: 'PCMSO', href: '/health-control', icon: Stethoscope },
    { title: 'eSocial', href: '/esocial-audit', icon: SearchCheck },
    { title: 'NAI', href: '/knowledge-base', icon: Sparkles },
    { title: 'Importação', href: '/data-import', icon: Database },
  ];

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-[#090e24] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 text-[#f59e0b]">
                <NextconLogo className="h-full w-full" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tighter uppercase font-headline">NEXTCON</span>
                <span className="text-[8px] font-bold text-[#f59e0b] uppercase tracking-widest">Saúde Empresarial</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2",
                    pathname === item.href 
                      ? "bg-[#f59e0b] text-[#090e24]" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right mr-2 hidden xl:block">
              <p className="text-[10px] font-bold text-white/50 uppercase leading-none">Usuário Conectado</p>
              <p className="text-xs font-bold text-[#f59e0b]">{user?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-white hover:bg-red-500/20 hover:text-red-400 gap-2 font-bold"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#090e24] border-t border-white/10 animate-in slide-in-from-top-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-sm font-bold uppercase tracking-wider flex items-center gap-3",
                  pathname === item.href 
                    ? "bg-[#f59e0b] text-[#090e24]" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-3 rounded-md text-sm font-bold uppercase tracking-wider text-red-400 hover:bg-red-400/10 flex items-center gap-3"
            >
              <LogOut className="h-5 w-5" />
              Sair do Sistema
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}