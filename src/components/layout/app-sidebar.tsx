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
  Hospital,
  CalendarDays,
  UserPlus,
  Thermometer
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
    label: "ESTRATÉGICO",
    icon: ShieldCheck,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT_ADMIN'],
    items: [
      { title: "Cérebro NAI", icon: Zap, href: "/" },
      { title: "BI & Analytics", icon: BarChart3, href: "/analytics" },
      { title: "Firewall e-Social", icon: SearchCheck, href: "/esocial-audit" },
      { title: "Assistente NAI", icon: Sparkles, href: "/knowledge-base" },
    ]
  },
  {
    label: "COMERCIAL & FINANCEIRO",
    icon: DollarSign,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { title: "Gerador de Propostas", icon: ShoppingCart, href: "/comercial" },
      { title: "Proposta Construção", icon: HardHat, href: "/comercial/construction-proposal" },
      { title: "Atendimento In Company", icon: UserPlus, href: "/comercial/multidisciplinary-proposal" },
      { title: "ERP Financeiro", icon: Database, href: "/financial" },
      { title: "ROI & Perícias", icon: Gavel, href: "/legal-financial" },
    ]
  },
  {
    label: "SAÚDE OCUPACIONAL",
    icon: HeartPulse,
    roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PROVIDER', 'CLIENT_ADMIN'],
    items: [
      { title: "Gestão de Saúde", icon: HeartPulse, href: "/medical/health-management" },
      { title: "Clínica Digital (ASO)", icon: Stethoscope, href: "/health-control" },
      { title: "Telemedicina Meet", icon: Video, href: "/telemedicine" },
      { title: "Validador Forense", icon: FileSearch, href: "/medical-certificates" },
    ]
  },
  {
    label: "SEGURANÇA DO TRABALHO",
    icon: HardHat,
    roles: ['SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'PROVIDER', 'CLIENT_ADMIN'],
    items: [
      { title: "Cards Operação", icon: CheckSquare, href: "/action-plans" },
      { title: "Escala Técnica", icon: CalendarDays, href: "/safety/operational-scale" },
      { title: "Profissionais de Campo", icon: HardHat, href: "/field-control" },
      { title: "Inventário PGR", icon: ClipboardCheck, href: "/risk-management" },
      { title: "Sentinela (NTEP)", icon: ShieldAlert, href: "/absenteeism" },
      { title: "Treinamentos NRs", icon: GraduationCap, href: "/trainings" },
    ]
  },
  {
    label: "ADMINISTRAÇÃO",
    icon: Database,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { title: "Quadro de Vidas", icon: Users, href: "/employees" },
      { title: "Central NAIGED", icon: ClipboardCheck, href: "/checklists" },
      { title: "Infra Cloud NAI", icon: Cloud, href: "/agency/cloud-infra" },
      { title: "Carga de Dados", icon: Database, href: "/data-import" },
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
            Intelligence 2026
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
                <div className="p-2 bg-white/10 rounded-xl shadow-inner border border-white/5">
                  <ModuleIcon className="size-4 text-slate-400" />
                </div>
                <span className="text-slate-400 text-[10px] font-[900] uppercase tracking-[0.15em] sidebar-header-glow leading-none">
                  {module.label}
                </span>
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1 ml-2">
                {module.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "h-10 px-4 rounded-xl transition-all duration-300 group",
                          isActive 
                            ? "bg-white/10 text-white font-bold border-l-4 border-slate-400" 
                            : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={cn("size-4 shrink-0", isActive ? "text-slate-400" : "text-white/20")} />
                          <span className="text-[12px] tracking-tight">{item.title}</span>
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
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
          <div className="size-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center font-black text-white text-xs shadow-xl">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black truncate uppercase tracking-tight text-white">{userName}</p>
            <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">{role.replace('_', ' ')}</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-white/20 hover:text-red-400 transition-all">
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
