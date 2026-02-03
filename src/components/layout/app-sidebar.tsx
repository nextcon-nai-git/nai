
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
  Map as MapIcon,
  ChevronRight
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

type Role = 'admin' | 'client' | 'employee'

const navGroups = [
  {
    label: "Administração Nextcon",
    roles: ['admin'],
    items: [
      { title: "Centro de Comando", icon: Lock, href: "/agency/command-center" },
      { title: "Mapa de Clientes", icon: MapIcon, href: "/agency/client-map" },
      { title: "Importação de Dados", icon: Database, href: "/data-import" },
    ]
  },
  {
    label: "Gestão Estratégica",
    roles: ['admin', 'client'],
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
    roles: ['admin', 'client'],
    items: [
      { title: "Gestão de Riscos (PGR)", icon: ShieldAlert, href: "/risk-management" },
      { title: "Vigilância Médica", icon: Stethoscope, href: "/health-control" },
      { title: "Sentinela do Limbo", icon: AlertTriangle, href: "/absenteeism" },
      { title: "Planos de Ação", icon: CheckSquare, href: "/action-plans" },
    ]
  },
  {
    label: "Área do Colaborador",
    roles: ['admin', 'client', 'employee'],
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
    return doc(db, "clients", user.uid)
  }, [db, user])

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef)

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  // Enquanto carrega o perfil, podemos mostrar um estado neutro ou assumir admin para evitar flicker
  const role = (profile?.role?.toLowerCase() || 'admin') as Role
  const userName = profile?.name || user?.email?.split('@')[0] || "Usuário"
  const userRoleLabel = 
    role === 'admin' ? "Administrador Nextcon" : 
    role === 'client' ? "Gestor de Empresa" : "Colaborador"
    
  const userInitial = userName.substring(0, 2).toUpperCase()

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0 shadow-2xl z-40">
      <SidebarHeader className="p-6 bg-primary/95">
        <div className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center text-accent shrink-0">
            <NextconLogo className="size-full" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden leading-none">
            <span className="font-headline font-black text-white text-xl tracking-tighter">
              NEXTCON
            </span>
            <span className="text-[9px] font-bold text-accent uppercase tracking-[0.25em] mt-1">
              SAÚDE EMPRESARIAL
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-primary pt-2">
        {navGroups.map((group) => {
          if (!group.roles.includes(role)) return null
          
          return (
            <SidebarGroup key={group.label} className="px-3">
              <SidebarGroupLabel className="text-white/30 px-4 text-[10px] uppercase tracking-[0.2em] font-black mb-1">
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
                        className={cn(
                          "relative h-11 px-4 mb-1 transition-all duration-300 rounded-lg group-hover:pl-5",
                          isActive 
                            ? "bg-white/10 text-white shadow-lg" 
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={cn(
                            "size-5 transition-transform duration-300",
                            isActive ? "text-accent scale-110" : "text-white/40"
                          )} />
                          <span className="font-medium tracking-wide text-sm">{item.title}</span>
                          {isActive && <div className="absolute left-0 w-1 h-6 bg-accent rounded-r-full" />}
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
      <SidebarFooter className="p-4 bg-primary border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
              <Avatar className="size-9 border-2 border-accent/20">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/40/40`} />
                <AvatarFallback className="bg-accent text-primary font-bold">{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden overflow-hidden">
                <span className="text-xs font-bold text-white truncate">{userName}</span>
                <span className="text-[9px] text-white/50 truncate uppercase font-black tracking-wider">{userRoleLabel}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-white/40 hover:text-accent hover:bg-white/5 rounded-lg transition-all group-data-[collapsible=icon]:hidden"
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
