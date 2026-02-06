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
  ShieldAlert,
  Search,
  Command
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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <div className="flex items-center gap-10 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <NextconLogo className="h-14 w-auto" />
            </Link>

            <div className="hidden xl:flex items-center space-x-1">
              {currentMenu.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-gray-500 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-gray-400")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 size-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar no sistema..." 
                className="w-full bg-gray-50 border-gray-100 h-10 pl-10 pr-12 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-gray-400"
              />
              <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-gray-200 bg-white flex items-center gap-1 text-[10px] font-black text-gray-400 pointer-events-none group-focus-within:hidden">
                <Command className="size-2.5" /> K
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 border-none shadow-2xl">
                <DropdownMenuLabel className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-50">
                  Alertas NAI
                  {unreadCount > 0 && <Badge className="bg-accent text-primary text-[8px]">{unreadCount} novos</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications?.length ? notifications.map(n => (
                  <DropdownMenuItem key={n.id} className="p-4 cursor-default flex flex-col items-start gap-1">
                    <p className={cn("text-xs font-bold", n.read ? "text-gray-400" : "text-primary")}>{n.title}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{n.message}</p>
                  </DropdownMenuItem>
                )) : (
                  <div className="p-8 text-center text-xs text-gray-400 italic">Sem alertas.</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-gray-100 gap-3 h-12 px-4 rounded-2xl">
                  <div className="text-right hidden xl:block">
                    <p className="text-[9px] font-black text-gray-400 uppercase leading-none">{role.replace('_', ' ')}</p>
                    <p className="text-xs font-bold text-primary">{user?.email?.split('@')[0]}</p>
                  </div>
                  <div className="size-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                    {user?.email?.substring(0, 2)}
                  </div>
                  <ChevronDown className="h-3 w-3 opacity-50 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-none shadow-2xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-tighter opacity-50">Configurações</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer font-bold text-xs"><Settings className="mr-2 h-4 w-4" /> Perfil</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-bold text-xs" asChild><Link href="/data-import"><Database className="mr-2 h-4 w-4" /> Importação</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 font-bold text-xs cursor-pointer" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-primary hover:bg-primary/5 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-50 p-4 space-y-2">
          {currentMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center gap-3",
                pathname === item.href ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"
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
