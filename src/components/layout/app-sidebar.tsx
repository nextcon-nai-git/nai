"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Stethoscope, 
  CheckSquare, 
  Users, 
  LogOut,
  TrendingUp,
  SearchCheck,
  Camera,
  Activity,
  AlertTriangle,
  Lock,
  Database,
  Sparkles,
  ClipboardList,
  Map as MapIcon,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth, useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase"
import { signOut } from "firebase/auth"
import { doc } from "firebase/firestore"
import { NextconLogo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Administração Nextcon",
    roles: ['admin', 'super_admin'],
    items: [
      { title: "Centro de Comando", icon: Lock, href: "/agency/command-center" },
      { title: "Módulo Financeiro", icon: DollarSign, href: "/financial" },
      { title: "Mapa de Clientes", icon: MapIcon, href: "/agency/client-map" },
      { title: "Importação de Dados", icon: Database, href: "/data-import" },
    ]
  },
  {
    label: "Gestão Estratégica",
    roles: ['admin', 'super_admin', 'client', 'client_admin'],
    items: [
      { title: "Dashboard Executivo", icon: LayoutDashboard, href: "/" },
      { title: "Quadro de Colaboradores", icon: Users, href: "/employees" },
      { title: "ROI & Jurídico", icon: TrendingUp, href: "/legal-financial" },
      { title: "Vigilante eSocial", icon: SearchCheck, href: "/esocial-audit" },
      { title: "Assistente NAI", icon: Sparkles, href: "/knowledge-base" },
    ]
  },
  {
    label: "Operação SST",
    roles: ['admin', 'super_admin', 'client', 'client_admin', 'provider'],
    items: [
      { title: "Gestão de Riscos (PGR)", icon: ShieldAlert, href: "/risk-management" },
      { title: "Vigilância Médica", icon: Stethoscope, href: "/health-control" },
      { title: "Sentinela do Limbo", icon: AlertTriangle, href: "/absenteeism" },
      { title: "Planos de Ação", icon: CheckSquare, href: "/action-plans" },
    ]
  },
  {
    label: "Área do Colaborador",
    roles: ['admin', 'super_admin', 'client', 'client_admin', 'employee'],
    items: [
      { title: "Quiosque de EPI", icon: Camera, href: "/ppe-kiosk" },
      { title: "Checklists & COPSOQ", icon: ClipboardList, href: "/checklists" },
      { title: "Termômetro Burnout", icon: Activity, href: "/psychosocial" },
    ]
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const auth = useAuth()
  const db = useFirestore()
  const { user } = useUser()
  const router = useRouter()

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])

  const { data: profile } = useDoc(profileRef)

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  const role = (profile?.role?.toLowerCase() || 'admin')
  const userName = profile?.name || user?.email?.split('@')[0] || "Usuário"
  const userRoleLabel = 
    role.includes('admin') ? "Administrador Nextcon" : 
    role.includes('client') ? "Gestor de Empresa" : 
    role.includes('provider') ? "Prestador / Clínica" : "Colaborador"
    
  const userInitial = userName.substring(0, 2).toUpperCase()

  return (
    <Sidebar variant="sidebar" collapsible="none" className="border-none bg-[#090e24] text-white w-[260px]">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center text-[#f59e0b] shrink-0">
            <NextconLogo className="size-full" />
          </div>
          <div className="flex flex-col leading-none overflow-hidden">
            <span className="font-headline font-black text-white text-xl tracking-tighter">
              NEXTCON
            </span>
            <span className="text-[9px] font-bold text-[#f59e0b] uppercase tracking-[0.25em] mt-1">
              SAÚDE EMPRESARIAL
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="pt-2">
        {navGroups.map((group) => {
          const hasAccess = group.roles.includes(role);
          if (!hasAccess) return null
          
          return (
            <SidebarGroup key={group.label} className="px-3">
              <SidebarGroupLabel className="text-white/40 px-4 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
                {group.label}
              </SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "relative h-11 px-4 mb-1 transition-none rounded-lg",
                          isActive 
                            ? "bg-[#f59e0b]/10 text-[#f59e0b]" 
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3 w-full">
                          <Icon className={cn(
                            "size-5 shrink-0",
                            isActive ? "text-[#f59e0b]" : "text-white/40"
                          )} />
                          <span className="font-medium tracking-wide text-sm whitespace-nowrap">
                            {item.title}
                          </span>
                          {isActive && <div className="absolute left-0 w-1 h-6 bg-[#f59e0b] rounded-r-full" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
              <Avatar className="size-9 border-2 border-[#f59e0b]/20 shrink-0">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/40/40`} />
                <AvatarFallback className="bg-[#f59e0b] text-[#090e24] font-bold">{userInitial}</AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-xs font-bold text-white truncate">{userName}</span>
                <span className="text-[9px] text-white/50 truncate uppercase font-black tracking-wider">{userRoleLabel}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-white/40 hover:text-[#f59e0b] transition-colors shrink-0"
                title="Sair do sistema"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}