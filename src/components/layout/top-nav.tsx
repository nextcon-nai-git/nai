
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LogOut, 
  Menu, 
  ChevronDown,
  LayoutDashboard, 
  ShieldAlert, 
  Stethoscope, 
  CheckSquare, 
  Users, 
  TrendingUp,
  SearchCheck,
  Camera,
  Activity,
  AlertTriangle,
  Lock,
  Database,
  Sparkles,
  ClipboardList,
  Map as MapIcon
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth, useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase"
import { signOut } from "firebase/auth"
import { doc } from "firebase/firestore"
import { NextconLogo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

type Role = 'admin' | 'client' | 'employee'

const navGroups = [
  {
    label: "Admin",
    roles: ['admin'],
    items: [
      { title: "Comando", icon: Lock, href: "/agency/command-center" },
      { title: "Mapa", icon: MapIcon, href: "/agency/client-map" },
      { title: "Importar", icon: Database, href: "/data-import" },
    ]
  },
  {
    label: "Estratégico",
    roles: ['admin', 'client'],
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/" },
      { title: "Equipe", icon: Users, href: "/employees" },
      { title: "ROI", icon: TrendingUp, href: "/legal-financial" },
      { title: "eSocial", icon: SearchCheck, href: "/esocial-audit" },
      { title: "NAI", icon: Sparkles, href: "/knowledge-base" },
    ]
  },
  {
    label: "Operacional",
    roles: ['admin', 'client'],
    items: [
      { title: "PGR", icon: ShieldAlert, href: "/risk-management" },
      { title: "Saúde", icon: Stethoscope, href: "/health-control" },
      { title: "Limbo", icon: AlertTriangle, href: "/absenteeism" },
      { title: "Ações", icon: CheckSquare, href: "/action-plans" },
    ]
  },
  {
    label: "Colaborador",
    roles: ['admin', 'client', 'employee'],
    items: [
      { title: "EPI", icon: Camera, href: "/ppe-kiosk" },
      { title: "Checklists", icon: ClipboardList, href: "/checklists" },
      { title: "Burnout", icon: Activity, href: "/psychosocial" },
    ]
  }
]

export function TopNav() {
  const pathname = usePathname()
  const auth = useAuth()
  const db = useFirestore()
  const { user } = useUser()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

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
    role === 'admin' ? "Administrador" : 
    role === 'client' ? "Gestor" : "Colaborador"
  const userInitial = userName.substring(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 text-accent shrink-0">
              <NextconLogo className="size-full" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-headline font-black text-primary-foreground text-lg tracking-tighter uppercase group-hover:text-accent transition-colors block">
                NEXTCON
              </span>
              <span className="text-[8px] font-bold text-accent uppercase tracking-widest leading-none block">
                SST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navGroups.map((group) => {
              if (!group.roles.includes(role)) return null
              return (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-1 h-9 px-3 text-xs font-bold uppercase tracking-wider">
                      {group.label} <ChevronDown className="size-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 p-1">
                    {group.items.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link href={item.href} className={cn(
                          "flex items-center gap-2 cursor-pointer p-2",
                          pathname === item.href ? "bg-primary/5 text-primary font-bold" : ""
                        )}>
                          <item.icon className="size-4" />
                          <span className="block">{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-white/10">
            <div className="text-right">
              <p className="text-xs font-bold text-primary-foreground leading-none">{userName}</p>
              <p className="text-[9px] text-accent font-black uppercase tracking-tighter">{userRoleLabel}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-8 cursor-pointer border border-white/20 hover:border-accent transition-colors">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/40/40`} />
                  <AvatarFallback className="bg-accent text-primary font-bold text-xs">{userInitial}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer gap-2">
                  <LogOut className="size-4" />
                  Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-primary-foreground hover:bg-white/10">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 bg-primary border-none text-primary-foreground">
              <SheetHeader className="p-6 border-b border-white/10">
                <SheetTitle className="flex items-center gap-2 text-primary-foreground">
                   <div className="size-8 text-accent"><NextconLogo className="size-full" /></div>
                   <span className="font-headline font-black tracking-tighter uppercase">NEXTCON</span>
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto max-h-[calc(100vh-80px)] p-4 space-y-6">
                {navGroups.map((group) => {
                  if (!group.roles.includes(role)) return null
                  return (
                    <div key={group.label} className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase text-accent tracking-[0.2em] px-4">{group.label}</h3>
                      <div className="grid grid-cols-1 gap-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                              pathname === item.href ? "bg-accent text-primary font-bold" : "text-primary-foreground/70 hover:bg-white/5 hover:text-primary-foreground"
                            )}
                          >
                            <item.icon className="size-5" />
                            <span className="text-sm block">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
                <div className="pt-4 border-t border-white/10">
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 px-4" onClick={handleLogout}>
                    <LogOut className="size-5" /> Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
