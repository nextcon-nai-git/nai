"use client"

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell,
  Search,
  Settings,
  ChevronDown,
  Menu,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
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
  const { user } = useUser();
  const db = useFirestore();
  const pathname = usePathname();

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);
  const role = (profile?.role || 'CLIENT_ADMIN').toUpperCase();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
          <span>Portal NextCon</span>
          <span className="opacity-30">/</span>
          <span className="text-slate-900 font-bold capitalize">{pathname === '/' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Pesquisar funcionários, laudos ou unidades..." 
            className="pl-10 h-10 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 font-bold text-[10px] px-3 py-1 uppercase hidden md:flex">
          <Building2 className="size-3 mr-2 text-primary" /> Unidade: Matriz Curitiba
        </Badge>

        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:bg-slate-50">
          <Bell className="size-5" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-destructive rounded-full border-2 border-white"></span>
        </Button>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:bg-slate-50 gap-3 px-2 h-10 rounded-lg">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none mb-1">{profile?.name || user?.email?.split('@')[0]}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{role.replace('_', ' ')}</p>
              </div>
              <div className="size-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xs">
                {user?.email?.substring(0, 2).toUpperCase()}
              </div>
              <ChevronDown className="size-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400">Minha Conta</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 cursor-pointer text-sm"><Settings className="size-4 opacity-50" /> Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive gap-2 cursor-pointer text-sm font-bold">Encerrar Sessão</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}