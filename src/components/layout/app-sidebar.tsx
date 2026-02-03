
"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Stethoscope, 
  CheckSquare, 
  Upload, 
  Users, 
  LogOut,
  TrendingUp,
  SearchCheck,
  Camera,
  Activity,
  AlertTriangle,
  Building2,
  Lock,
  Database,
  Sparkles,
  ClipboardList,
  UserCircle,
  Map as MapIcon
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

type Role = 'admin' | 'client' | 'employee'

const navGroups = [
  {
    label: "ADMINISTRAÇÃO NEXTCON",
    roles: ['admin'],
    items: [
      { title: "Centro de Comando", icon: Lock, href: "/agency/command-center" },
      { title: "Mapa de Clientes", icon: MapIcon, href: "/agency/client-map" },
      { title: "Módulo de Importação", icon: Database, href: "/data-import" },
    ]
  },
  {
    label: "VISÃO DO CLIENTE",
    roles: ['admin', 'client'],
    items: [
      { title: "Dashboard Executivo", icon: LayoutDashboard, href: "/" },
      { title: "Colaboradores", icon: Users, href: "/employees" },
      { title: "ROI & Jurídico", icon: TrendingUp, href: "/legal-financial" },
      { title: "Auditoria eSocial", icon: SearchCheck, href: "/esocial-audit" },
      { title: "Assistente NAI", icon: Sparkles, href: "/knowledge-base" },
    ]
  },
  {
    label: "OPERAÇÃO SST",
    roles: ['admin', 'client'],
    items: [
      { title: "Gestão de Riscos (PGR)", icon: ShieldAlert, href: "/risk-management" },
      { title: "Controle de Saúde (PCMSO)", icon: Stethoscope, href: "/health-control" },
      { title: "Sentinela do Limbo", icon: AlertTriangle, href: "/absenteeism" },
      { title: "Planos de Ação", icon: CheckSquare, href: "/action-plans" },
    ]
  },
  {
    label: "ÁREA DO COLABORADOR",
    roles: ['admin', 'client', 'employee'],
    items: [
      { title: "Quiosque de EPI", icon: Camera, href: "/ppe-kiosk" },
      { title: "Pesquisas & COPSOQ", icon: ClipboardList, href: "/checklists" },
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
    return doc(db, "clients", user.uid)
  }, [db, user])

  const { data: profile } = useDoc(profileRef)

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  const role = (profile?.role?.toLowerCase() || 'admin') as Role
  const userName = profile?.name || user?.email?.split('@')[0] || "Usuário"
  const userRoleLabel = 
    role === 'admin' ? "Administrador Nextcon" : 
    role === 'client' ? "Gestor de Empresa" : "Colaborador"
    
  const userInitial = userName.substring(0, 2).toUpperCase()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center text-white shrink-0">
            <NextconLogo className="size-full" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden leading-tight">
            <span className="font-headline font-black text-white text-lg tracking-tighter">
              NEXTCON
            </span>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] -mt-1">
              SST
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => {
          if (!group.roles.includes(role)) return null
          
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-sidebar-foreground/50 px-4 text-[10px] uppercase tracking-widest font-black">
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
                        tooltip={item.title}
                        className={`hover:bg-white/10 transition-all duration-200 py-6 ${isActive ? 'bg-white/10 text-white border-l-4 border-white' : ''}`}
                      >
                        <Link href={item.href}>
                          <Icon className={`size-5 ${isActive ? 'text-white' : 'text-sidebar-foreground/60'}`} />
                          <span className="font-medium">{item.title}</span>
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
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
              <Avatar className="size-9 border-2 border-white/20">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/40/40`} />
                <AvatarFallback className="bg-primary text-white">{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">{userName}</span>
                <span className="text-[10px] text-sidebar-foreground/70 truncate max-w-[120px] uppercase font-bold">{userRoleLabel}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sidebar-foreground/50 hover:text-white group-data-[collapsible=icon]:hidden"
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
