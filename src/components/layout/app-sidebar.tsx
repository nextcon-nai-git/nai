
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
  AlertTriangle,
  Lock,
  Database,
  Sparkles,
  DollarSign,
  ClipboardCheck,
  BarChart3,
  FileSearch,
  GraduationCap,
  Building2,
  Settings,
  Zap,
  HardHat,
  Monitor,
  HeartPulse,
  Scale,
  Brain,
  Cloud,
  Terminal,
  Upload,
  ShoppingCart,
  ShieldCheck,
  Gavel
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth, useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase"
import { signOut } from "firebase/auth"
import { doc } from "firebase/firestore"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Equipe Nextcon (Interno)",
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { title: "Dashboard Global", icon: BarChart3, href: "/analytics" },
      { title: "ROI & Financeiro", icon: DollarSign, href: "/financial" },
      { title: "Gestão de Clientes", icon: Building2, href: "/agency/command-center" },
      { title: "Infraestrutura Cloud", icon: Cloud, href: "/agency/cloud-infra" },
      { title: "Carga de Dados", icon: Database, href: "/data-import" },
      { title: "Setup Auditoria", icon: ShieldCheck, href: "/audit-setup" },
      { title: "Importar Clientes", icon: Upload, href: "/importar" },
    ]
  },
  {
    label: "Crescimento & Vendas",
    roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT_ADMIN'],
    items: [
      { title: "Proposta Comercial", icon: ShoppingCart, href: "/comercial" },
    ]
  },
  {
    label: "Operação Técnica",
    roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT_ADMIN', 'PROVIDER', 'ENGINEER', 'DOCTOR'],
    items: [
      { title: "Cards Operação", icon: CheckSquare, href: "/action-plans" },
      { title: "Auditoria Médica", icon: Gavel, href: "/medical-auditing" },
      { title: "Field Control", icon: HardHat, href: "/field-control" },
      { title: "Auditoria eSocial", icon: SearchCheck, href: "/esocial-audit" },
      { title: "Central de Laudos", icon: ClipboardCheck, href: "/checklists" },
      { title: "Saúde Ocupacional", icon: Stethoscope, href: "/health-control" },
      { title: "Treinamentos NRs", icon: GraduationCap, href: "/trainings" },
    ]
  },
  {
    label: "Segurança de Vidas",
    roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT_ADMIN'],
    items: [
      { title: "Quadro de Vidas", icon: Users, href: "/employees" },
      { title: "Vigilância Médica", icon: HeartPulse, href: "/client/exams" },
      { title: "Sentinela (NTEP)", icon: AlertTriangle, href: "/absenteeism" },
      { title: "Risco Psicossocial", icon: Brain, href: "/psychosocial" },
      { title: "Quiosque EPI", icon: Lock, href: "/ppe-kiosk" },
      { title: "Validador Atestados", icon: FileSearch, href: "/medical-certificates" },
      { title: "Assistente NAI", icon: Sparkles, href: "/knowledge-base" },
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
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(role)
  const userName = profile?.name || user?.email?.split('@')[0] || "Usuário"
  
  return (
    <Sidebar className={cn(
      "border-r border-sidebar-border text-white w-[260px] transition-colors duration-500",
      isAdmin ? "bg-[#001F3F]" : "bg-[#003366]"
    )}>
      <SidebarHeader className="p-8">
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black tracking-tighter leading-none">
            {isAdmin ? 'NAI' : 'NEXTCON'}
          </span>
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.1em]">
            {isAdmin ? 'NEXTCON AI' : 'Inteligência NAI em SST'}
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenuItem className="mb-4 list-none">
          <SidebarMenuButton 
            asChild 
            isActive={pathname === '/'}
            className={cn(
              "h-11 px-4 rounded-xl transition-all group",
              pathname === '/' 
                ? "bg-white/10 text-white font-bold border-l-4 border-accent" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Link href="/" className="flex items-center gap-3">
              <LayoutDashboard className={cn("size-4", pathname === '/' ? "text-accent" : "text-white/30 group-hover:text-white/60")} />
              <span className="text-sm">Início (SESMT)</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {navGroups.map((group) => {
          const hasAccess = group.roles.some(r => r.toUpperCase() === role);
          if (!hasAccess) return null
          
          return (
            <SidebarGroup key={group.label} className="py-2">
              <SidebarGroupLabel className="text-white/30 px-2 text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                {group.label === "Equipe Nextcon (Interno)" && <Lock className="size-3" />}
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
                          "h-11 px-4 rounded-xl transition-all group",
                          isActive 
                            ? "bg-white/10 text-white font-bold border-l-4 border-accent" 
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

      <SidebarFooter className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
          <div className={cn(
            "size-9 rounded-xl flex items-center justify-center font-black text-[10px] shadow-inner",
            isAdmin ? "bg-accent text-primary" : "bg-primary text-white"
          )}>
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate uppercase tracking-tight">{userName}</p>
            <p className="text-[8px] text-white/40 uppercase font-black">{role.replace('_', ' ')}</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-white/20 hover:text-accent transition-colors">
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
