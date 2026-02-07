"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
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
  Map as MapIcon,
  DollarSign,
  ClipboardCheck,
  Building2,
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
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Administração",
    roles: ['SUPER_ADMIN', 'admin'],
    items: [
      { title: "Centro de Comando", icon: Lock, href: "/agency/command-center" },
      { title: "Faturamento", icon: DollarSign, href: "/financial" },
      { title: "Mapa de Clientes", icon: MapIcon, href: "/agency/client-map" },
      { title: "Base de Dados", icon: Database, href: "/data-import" },
    ]
  },
  {
    label: "Gestão Estratégica",
    roles: ['SUPER_ADMIN', 'CLIENT_ADMIN', 'admin'],
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/" },
      { title: "Colaboradores", icon: Users, href: "/employees" },
      { title: "Auditoria eSocial", icon: SearchCheck, href: "/esocial-audit" },
      { title: "ROI & Jurídico", icon: TrendingUp, href: "/legal-financial" },
      { title: "Assistente NAI", icon: Sparkles, href: "/knowledge-base" },
    ]
  },
  {
    label: "Operação Técnica",
    roles: ['SUPER_ADMIN', 'CLIENT_ADMIN', 'PROVIDER', 'admin'],
    items: [
      { title: "Central de Laudos", icon: ClipboardCheck, href: "/checklists" },
      { title: "Controle Médico", icon: Stethoscope, href: "/health-control" },
      { title: "Planos de Ação", icon: CheckSquare, href: "/action-plans" },
      { title: "Sentinela (NTEP)", icon: AlertTriangle, href: "/absenteeism" },
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

  const role = (profile?.role || 'CLIENT_ADMIN').toUpperCase()
  const userName = profile?.name || user?.email?.split('@')[0] || "Usuário"
  
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground w-[260px]">
      <SidebarHeader className="p-6">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-black tracking-tighter leading-none">NEXTCON</span>
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Saúde Empresarial</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        {navGroups.map((group) => {
          const hasAccess = group.roles.includes(role);
          if (!hasAccess) return null
          
          return (
            <SidebarGroup key={group.label} className="py-2">
              <SidebarGroupLabel className="text-white/40 px-4 text-[10px] font-black uppercase tracking-widest mb-2">
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
                          "h-10 px-4 rounded-md transition-all group",
                          isActive 
                            ? "bg-white/10 text-white font-semibold" 
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={cn("size-4", isActive ? "text-accent" : "text-white/30 group-hover:text-white/60")} />
                          <span className="text-sm">{item.title}</span>
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

      <SidebarFooter className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="size-8 rounded-md border border-white/10">
            <AvatarFallback className="bg-white/10 text-[10px] font-bold">{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{userName}</p>
            <p className="text-[9px] text-white/40 uppercase font-black">{role.replace('_', ' ')}</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-white/20 hover:text-white transition-colors">
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}