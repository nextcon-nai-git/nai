"use client"

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  SearchCheck, 
  LogOut,
  Database,
  Lock,
  Sparkles,
  TrendingUp,
  Activity,
  ChevronDown,
  Settings,
  BadgeCheck,
  HeartPulse,
  CalendarDays,
  FolderOpen,
  Bell,
  DollarSign,
  ClipboardCheck,
  Search,
  Command,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useUser, useDoc, useMemoFirebase, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { NextconLogo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';

export function TopNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);
  
  const role = (profile?.role || 'CLIENT_ADMIN').toUpperCase();

  const navStructure = {
    SUPER_ADMIN: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Financeiro", href: "/financial", icon: DollarSign },
      { label: "Operações", href: "/checklists", icon: ClipboardCheck },
      { label: "Clientes", href: "/agency/client-map", icon: Building2 },
    ],
    CLIENT_ADMIN: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Colaboradores", href: "/employees", icon: Users },
      { label: "Documentos", href: "/reports", icon: FolderOpen },
      { label: "Auditoria", href: "/esocial-audit", icon: SearchCheck },
      { label: "NAI", href: "/knowledge-base", icon: Sparkles },
    ]
  };

  const currentMenu = navStructure[role as keyof typeof navStructure] || navStructure.CLIENT_ADMIN;

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24 gap-8">
          <div className="flex items-center gap-12 shrink-0">
            <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
              <NextconLogo className="h-16 w-auto text-primary" />
            </Link>

            <div className="hidden xl:flex items-center space-x-2">
              {currentMenu.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 shrink-0",
                      isActive 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "text-primary/40 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-primary/20")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 size-4 text-primary/20 group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisa inteligente NAI..." 
                className="w-full bg-gray-50/50 border-gray-100 h-12 pl-12 pr-12 text-xs font-bold rounded-2xl focus-visible:ring-primary/5 focus-visible:border-primary/20 transition-all placeholder:text-primary/20 shadow-inner"
              />
              <div className="absolute right-3 top-3 px-2 py-1 rounded-lg border border-gray-200 bg-white flex items-center gap-1.5 text-[9px] font-black text-primary/30 pointer-events-none group-focus-within:hidden">
                <Command className="size-3" /> K
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-primary/40 hover:bg-primary/5 h-12 w-12 rounded-2xl">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-accent border-2 border-white shadow-sm"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 border-none shadow-2xl p-2 rounded-[1.5rem]">
                <DropdownMenuLabel className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest p-4 text-primary/40">
                  Notificações do Sistema
                </DropdownMenuLabel>
                <div className="p-8 text-center text-[10px] font-black text-primary/20 uppercase tracking-widest">Sem alertas novos</div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-primary/5 gap-4 h-14 px-5 rounded-[1.25rem] transition-all active:scale-95">
                  <div className="text-right hidden xl:block">
                    <p className="text-[9px] font-black text-primary/30 uppercase leading-none mb-1 tracking-widest">{role.replace('_', ' ')}</p>
                    <p className="text-xs font-black text-primary uppercase tracking-tight">{user?.email?.split('@')[0]}</p>
                  </div>
                  <div className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-primary/20">
                    {user?.email?.substring(0, 2)}
                  </div>
                  <ChevronDown className="h-3 w-3 opacity-30 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 border-none shadow-2xl p-2 rounded-[1.5rem] mt-2">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest p-4 text-primary/40">Sua Conta</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer font-black text-[10px] uppercase h-12 rounded-xl px-4 gap-3"><Settings className="size-4 text-primary/20" /> Configurações</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-black text-[10px] uppercase h-12 rounded-xl px-4 gap-3" asChild><Link href="/data-import"><Database className="size-4 text-primary/20" /> Base de Dados</Link></DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-50" />
                <DropdownMenuItem className="text-red-500 font-black text-[10px] uppercase h-12 rounded-xl px-4 gap-3 cursor-pointer" onClick={handleLogout}><LogOut className="size-4" /> Encerrar Sessão</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-primary bg-primary/5 hover:bg-primary hover:text-white transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
          {currentMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-4 transition-all",
                pathname === item.href ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-primary/40 hover:bg-primary/5"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}