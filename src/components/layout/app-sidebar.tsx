
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
  ChevronRight
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  {
    label: "Operational",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/" },
      { title: "Risk Management", icon: ShieldAlert, href: "/risk-management" },
      { title: "Employees", icon: Users, href: "/employees" },
    ]
  },
  {
    label: "Medical",
    items: [
      { title: "Health Control", icon: Stethoscope, href: "/health-control" },
      { title: "Medical Exams", icon: FileText, href: "/exams" },
    ]
  },
  {
    label: "Legal & Management",
    items: [
      { title: "Legal & Financial", icon: Gavel, href: "/legal-financial" },
      { title: "Action Plans", icon: CheckSquare, href: "/action-plans" },
      { title: "Data Import", icon: Upload, href: "/data-import" },
    ]
  },
  {
    label: "Admin",
    items: [
      { title: "ESG Scorecard", icon: PieChart, href: "/esg" },
      { title: "Settings", icon: Settings, href: "/settings" },
    ]
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="font-headline font-bold text-white group-data-[collapsible=icon]:hidden">
            NextCon <span className="text-accent">SST</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 px-4 text-[10px] uppercase tracking-wider font-bold">
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
                      className={`hover:bg-sidebar-accent transition-all ${isActive ? 'bg-sidebar-accent text-white' : ''}`}
                    >
                      <Link href={item.href}>
                        <item.icon className={`size-4 ${isActive ? 'text-accent' : ''}`} />
                        <span>{item.title}</span>
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
            <div className="flex items-center gap-3 p-2 bg-sidebar-accent/30 rounded-lg group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
              <Avatar className="size-8">
                <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-bold text-white">Admin User</span>
                <span className="text-[10px] text-sidebar-foreground/70">Safety Tech</span>
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
