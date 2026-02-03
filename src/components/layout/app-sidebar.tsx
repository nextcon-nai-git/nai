
"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Stethoscope, 
  Gavel, 
  CheckSquare, 
  Upload, 
  Settings, 
  Users, 
  FileText, 
  PieChart,
  LogOut,
  TrendingUp,
  SearchCheck,
  Camera,
  Activity,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

const navItems = [
  {
    label: "Estratégico & Financeiro",
    items: [
      { title: "Dashboard CFO", icon: LayoutDashboard, href: "/" },
      { title: "ROI & Jurídico", icon: TrendingUp, href: "/legal-financial" },
      { title: "Pré-Auditoria eSocial", icon: SearchCheck, href: "/esocial-audit" },
    ]
  },
  {
    label: "Sentinelas de Risco",
    items: [
      { title: "Sentinela do Limbo", icon: AlertTriangle, href: "/absenteeism" },
      { title: "Termômetro Burnout", icon: Activity, href: "/psychosocial" },
    ]
  },
  {
    label: "Operacional (SST)",
    items: [
      { title: "Gestão de Riscos (PGR)", icon: ShieldAlert, href: "/risk-management" },
      { title: "Controle de Saúde (PCMSO)", icon: Stethoscope, href: "/health-control" },
      { title: "Quiosque de EPI", icon: Camera, href: "/ppe-kiosk" },
      { title: "Colaboradores", icon: Users, href: "/employees" },
    ]
  },
  {
    label: "Gestão de Ação",
    items: [
      { title: "Planos de Ação", icon: CheckSquare, href: "/action-plans" },
      { title: "Importação CSV", icon: Upload, href: "/data-import" },
    ]
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold shadow-lg shadow-accent/20">
            N
          </div>
          <span className="font-headline font-bold text-white group-data-[collapsible=icon]:hidden text-lg tracking-tight">
            NextCon <span className="text-accent">SST</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 px-4 text-[10px] uppercase tracking-widest font-black">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={`hover:bg-sidebar-accent transition-all duration-200 py-6 ${isActive ? 'bg-sidebar-accent text-white border-l-4 border-accent' : ''}`}
                    >
                      <Link href={item.href}>
                        <item.icon className={`size-5 ${isActive ? 'text-accent' : 'text-sidebar-foreground/60'}`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-3 bg-sidebar-accent/30 rounded-xl group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
              <Avatar className="size-9 border-2 border-accent/20">
                <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-bold text-white">Rodrigo Silva</span>
                <span className="text-[10px] text-sidebar-foreground/70">Diretor de HSE</span>
              </div>
              <button className="text-sidebar-foreground/50 hover:text-accent group-data-[collapsible=icon]:hidden">
                <LogOut className="size-4" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
