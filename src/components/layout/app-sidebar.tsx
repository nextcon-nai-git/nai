"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  Stethoscope, 
  CheckSquare, 
  Users, 
  LogOut,
  BarChart3,
  SearchCheck,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  DollarSign,
  ClipboardCheck,
  FileSearch,
  GraduationCap,
  Monitor,
  HeartPulse,
  Scale,
  Brain,
  Cloud,
  Database,
  ShoppingCart,
  Gavel,
  Video,
  HardHat,
  Zap,
  Network,
  Lock
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
import { useAuth, useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase"
import { signOut } from "firebase/auth"
import { doc } from "firebase/firestore"
import { cn } from "@/lib/utils"

const NAV_MODULES = [
  {
    label: "DASHBOARD CONTROLE",
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT_ADMIN'],
    items: [
      { title: "Cérebro NAI (Início)", icon: Zap, href: "/" },
      { title: "BI SST & Analytics", icon: BarChart3, href: "/analytics", roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT_ADMIN'] },
      { title: "Quadro de Vidas", icon: Users, href: "/employees" },
      { title: "Firewall eSocial", icon: SearchCheck, href: "/esocial-audit" },
      { title: "Assistente NAI", icon: Sparkles, href: "/knowledge-base" },
      { title: "Infra Cloud NAI", icon: Cloud, href: "/agency/cloud-infra", roles: ['SUPER_ADMIN', 'ADMIN'] },
      { title: "Carga de Dados", icon: Database, href: "/data-import", roles: ['SUPER_ADMIN', 'ADMIN'] },
      { title: "Setup Auditoria", icon: ShieldCheck, href: "/audit-setup", roles: ['SUPER_ADMIN', 'ADMIN'] },
    ]
  },
  {
    label: "COMERCIAL",
    icon: ShoppingCart,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { title: "Proposta NAI", icon: DollarSign, href: "/comercial" },
      { title: "Simulador de Escala", icon: Monitor, href: "/simulator" },
    ]
  },
  {
    label: "FINANCEIRO",
    icon: Scale,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { title: "ERP Financeiro", icon: Database, href: "/financial" },
      { title: "ROI & Perícias", icon: Gavel, href: "/legal-financial" },
      { title: "NAI API 2.0", icon: Network, href: "#", roles: ['SUPER_ADMIN', 'ADMIN'] },
    ]
  },
  {
    label: "SAÚDE OCUPACIONAL",
    icon: HeartPulse,
    roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PROVIDER'],
    items: [
      { title: "Telemedicina Meet", icon: Video, href: "/telemedicine" },
      { title: "Vigilância Médica", icon: HeartPulse, href: "/client/exams" },
      { title: "Validador Forense", icon: FileSearch, href: "/medical-certificates" },
      { title: "Auditoria Médica", icon: Gavel, href: "/medical-auditing" },
      { title: "Risco Psicossocial", icon: Brain, href: "/psychosocial" },
      { title: "Fila de Atendimento", icon: Stethoscope, href: "/health-control" },
    ]
  },
  {
    label: "SEGURANÇA DO TRABALHO",
    icon: HardHat,
    roles: ['SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'PROVIDER'],
    items: [
      { title: "Cards Operação", icon: CheckSquare, href: "/action-plans" },
      { title: "Controle Campo IoT", icon: HardHat, href: "/field-control" },
      { title: "Inventário PGR", icon: ClipboardCheck, href: "/risk-management" },
      { title: "Central NAIGED", icon: ClipboardCheck, href: "/checklists" },
      { title: "Quiosque Digital EPI", icon: Lock, href: "/ppe-kiosk" },
      { title: "Treinamentos NRs", icon: GraduationCap, href: "/trainings" },
      { title: "Sentinela (NTEP)", icon: ShieldAlert, href: "/absenteeism" },
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
    <Sidebar className="border-r border-sidebar-border bg-gradient-to-b from-[#001F3F] via-[#003366] to-[#001F3F] text-white transition-all duration-700 shadow-2xl">
      <SidebarHeader className="p-10 pb-6">
        <div className="flex flex-col gap-1 group cursor-default">
          <span className="text-4xl font-black tracking-tighter leading-none sidebar-header-glow transition-all duration-500 group-hover:scale-105">
            {isAdmin ? 'NAI' : 'NEXTCON'}
          </span>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
            {isAdmin ? 'Nextcon Inteligência' : 'SST Intelligence'}
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-6 pb-10 scrollbar-thin">
        {NAV_MODULES.map((module) => {
          const hasModuleAccess = module.roles.includes(role);
          if (!hasModuleAccess) return null;

          const ModuleIcon = module.icon;

          return (
            <SidebarGroup key={module.label} className="py-6 first:pt-2">
              <SidebarGroupLabel className="flex items-center gap-3 px-4 h-auto mb-4 pointer-events-none">
                <div className="p-2 bg-white/10 rounded-xl shadow-inner border border-white/5 group-hover:bg-slate-700/20 transition-colors">
                  <ModuleIcon className="size-4 text-slate-400" />
                </div>
                <span className="text-slate-400 text-xs font-[900] uppercase tracking-[0.15em] sidebar-header-glow leading-none">
                  {module.label}
                </span>
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1.5 ml-2">
                {module.items.map((item) => {
                  if (item.roles && !item.roles.includes(role)) return null;

                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "h-11 px-4 rounded-xl transition-all duration-300 group",
                          isActive 
                            ? "bg-white/10 text-white font-bold border-l-4 border-slate-400 shadow-lg shadow-black/5" 
                            : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-slate-400" : "text-white/20 group-hover:text-white/60")} />
                          <span className="text-[13px] tracking-tight">{item.title}</span>
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

      <SidebarFooter className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-default">
          <div className="relative">
            <div className="size-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center font-black text-white text-xs shadow-xl shrink-0">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 size-3 bg-slate-400 rounded-full border-2 border-[#001F3F]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-[900] truncate uppercase tracking-tight text-white">{userName}</p>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
              {role.replace('_', ' ')}
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
            title="Sair do Sistema"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}