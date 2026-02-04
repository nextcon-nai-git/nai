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
  ClipboardList,
  Building2,
  ChevronDown,
  Settings,
  BadgeCheck,
  FileText,
  UserCircle,
  HeartPulse,
  CalendarDays,
  FolderOpen,
  Bell,
  DollarSign,
  ClipboardCheck,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);
  
  const role = (profile?.role || 'CLIENT_ADMIN').toUpperCase();

  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }, [db, user]);

  const { data: notifications } = useCollection(notificationsQuery);
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const navStructure = {
    SUPER_ADMIN: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Financeiro", href: "/financial", icon: DollarSign },
      { label: "Checklists", href: "/checklists", icon: ClipboardCheck },
      { label: "Clientes", href: "/agency/client-map", icon: Building2 },
      { label: "Importação", href: "/data-import", icon: Database },
    ],
    CLIENT_ADMIN: [
      { label: "Visão Geral", href: "/", icon: LayoutDashboard },
      { label: "Colaboradores", href: "/employees", icon: Users },
      { label: "Checklists", href: "/checklists", icon: ClipboardCheck },
      { label: "eSocial", href: "/esocial-audit", icon: SearchCheck },
      { label: "NAI AI", href: "/knowledge-base", icon: Sparkles },
    ],
    PROVIDER: [
      { label: "Início", href: "/", icon: LayoutDashboard },
      { label: "Atendimento", href: "/client/exams", icon: HeartPulse },
      { label: "Checklists", href: "/checklists", icon: ClipboardCheck },
      { label: "Agenda", href: "/health-control", icon: CalendarDays },
    ],
    EMPLOYEE: [
      { label: "Meu Crachá", href: "/ppe-kiosk", icon: BadgeCheck },
      { label: "Checklists", href: "/checklists", icon: ClipboardCheck },
      { label: "Documentos", href: "/reports", icon: FolderOpen },
      { label: "Saúde", href: "/psychosocial", icon: Activity },
    ]
  };

  const currentMenu = navStructure[role as keyof typeof navStructure] || navStructure.CLIENT_ADMIN;

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-[#090e24] text-white sticky top-0 z-50 shadow-lg border-b border-white/5">
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

            <div className="hidden lg:flex items-center space-x-1">
              {currentMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      pathname === item.href 
                        ? "bg-[#f59e0b] text-[#090e24] shadow-lg shadow-[#f59e0b]/20" 
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/5">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-[#090e24] text-white border-white/10">
                <DropdownMenuLabel className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-50">
                  Alertas NAI
                  {unreadCount > 0 && <Badge className="bg-accent text-[#090e24] text-[8px]">{unreadCount} novos</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {notifications?.length ? notifications.map(n => (
                  <DropdownMenuItem key={n.id} className="p-4 hover:bg-white/5 cursor-default flex flex-col items-start gap-1">
                    <p className={cn("text-xs font-bold", n.read ? "text-white/50" : "text-white")}>{n.title}</p>
                    <p className="text-[10px] text-white/40 leading-tight">{n.message}</p>
                  </DropdownMenuItem>
                )) : (
                  <div className="p-8 text-center text-xs text-white/30 italic">Sem alertas no momento.</div>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-center justify-center text-[9px] font-black uppercase tracking-tighter text-accent cursor-pointer">
                  Ver Todas as Notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/5 gap-3 h-10 px-4 ml-2">
                  <div className="text-right hidden xl:block">
                    <p className="text-[9px] font-black text-white/50 uppercase leading-none">{role.replace('_', ' ')}</p>
                    <p className="text-xs font-bold text-[#f59e0b]">{user?.email}</p>
                  </div>
                  <UserCircle className="h-5 w-5 text-[#f59e0b]" />
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#090e24] text-white border-white/10">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-tighter opacity-50">Configurações</DropdownMenuLabel>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Perfil de Usuário
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" asChild>
                  <Link href="/data-import"><Database className="mr-2 h-4 w-4" /> Importar Dados</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Encerrar Sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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

      {isOpen && (
        <div className="lg:hidden bg-[#090e24] border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentMenu.map((item) => {
              const Icon = item.icon;
              return (
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
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-white/10 px-3 pb-4">
              <Button
                variant="destructive"
                className="w-full justify-start gap-3 h-12"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Encerrar Sessão
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
