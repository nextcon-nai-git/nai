
"use client"

import * as React from "react"
import { 
  DollarSign, 
  Receipt, 
  Tags, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Database, 
  Percent, 
  Plug, 
  Download,
  Plus,
  Search,
  AlertCircle,
  CreditCard,
  History,
  CheckCircle2,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function FinancialModule() {
  const [activeTab, setActiveTab] = React.useState("billing")

  const summary = [
    { title: "A Receber (Mês)", amount: "R$ 142.500,00", trend: "+12%", icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "A Pagar (Rede)", amount: "R$ 58.200,00", trend: "-5%", icon: ArrowDownLeft, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Inadimplência", amount: "2.4%", trend: "Estável", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { title: "Ticket Médio/Vida", amount: "R$ 18,40", trend: "+3%", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
  ]

  const erpConnectors = [
    { name: "Conta Azul", status: "Online", color: "bg-emerald-500" },
    { name: "Omie", status: "Online", color: "bg-emerald-500" },
    { name: "Senior", status: "Pendente", color: "bg-amber-500" },
    { name: "Questor", status: "Online", color: "bg-emerald-500" },
  ]

  const recentInvoices = [
    { id: "INV-2025-001", client: "Transportes Rapidez", date: "10/02/2025", amount: "R$ 4.250,00", status: "Pago" },
    { id: "INV-2025-002", client: "Metalúrgica Norte", date: "12/02/2025", amount: "R$ 8.900,00", status: "Pendente" },
    { id: "INV-2025-003", client: "Logística Express", date: "15/02/2025", amount: "R$ 2.100,00", status: "Atrasado" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Módulo Financeiro (Billing)</h1>
          <p className="text-muted-foreground">Faturamento, precificação e conectores ERP em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary text-primary h-11 px-6">
            <Download className="size-4" /> Exportar Tabelas
          </Button>
          <Button className="bg-[#f59e0b] text-[#090e24] hover:bg-[#f59e0b]/90 gap-2 h-11 px-6 shadow-lg font-bold">
            <Plus className="size-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item) => (
          <Card key={item.title} className="border-none shadow-sm bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <Badge variant="outline" className="text-[8px] font-black">{item.trend}</Badge>
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{item.title}</p>
              <h2 className="text-xl font-bold text-primary">{item.amount}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="billing" className="rounded-lg gap-2 text-xs font-bold">
            <Receipt className="size-4" /> Faturamento
          </TabsTrigger>
          <TabsTrigger value="pricing" className="rounded-lg gap-2 text-xs font-bold">
            <Tags className="size-4" /> Precificação
          </TabsTrigger>
          <TabsTrigger value="cadastros" className="rounded-lg gap-2 text-xs font-bold">
            <Database className="size-4" /> Cadastros
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg gap-2 text-xs font-bold">
            <Plug className="size-4" /> Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-lg font-bold text-primary">Faturas Recentes</CardTitle>
                  <CardDescription>Histórico de cobranças e faturamentos emitidos.</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input placeholder="Buscar fatura..." className="pl-9 bg-white text-xs h-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50/50 text-[10px] uppercase font-black tracking-widest">
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvoices.map((inv) => (
                      <TableRow key={inv.id} className="hover:bg-gray-50">
                        <TableCell className="font-bold text-xs">{inv.client}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                        <TableCell className="font-black text-xs">{inv.amount}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase border-none",
                            inv.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' :
                            inv.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          )}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 bg-gray-50 border-t">
                  <Button className="w-full bg-[#090e24] text-white font-black uppercase text-[10px] tracking-widest h-10">
                    Gerar Faturamento em Lote
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-[#090e24] text-white">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase text-[#f59e0b] tracking-widest">Auditoria de Contas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span>Exames Realizados</span>
                    <span>1,240</span>
                  </div>
                  <Progress value={100} className="h-1.5 bg-white/10" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span>Exames Auditados</span>
                    <span>982</span>
                  </div>
                  <Progress value={79} className="h-1.5 bg-white/10" />
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <p className="text-[10px] text-[#f59e0b] font-black uppercase">Pronto para Faturar</p>
                  <p className="text-xs leading-relaxed opacity-80 italic">
                    Existem 258 eventos de saúde do mês anterior que ainda não foram convertidos em faturas.
                  </p>
                  <Button variant="outline" className="w-full text-[10px] font-black h-10 mt-2 text-white border-white/20 hover:bg-white/10 gap-2">
                    <RefreshCw className="size-3" /> Conciliar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {erpConnectors.map((erp) => (
              <Card key={erp.name} className="border-none shadow-lg hover:ring-2 ring-primary/10 transition-all bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary border border-primary/10">
                      {erp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn("size-2.5 rounded-full shadow-sm", erp.color, erp.status === 'Online' && 'animate-pulse')}></div>
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">{erp.status}</span>
                    </div>
                  </div>
                  <h3 className="font-black text-primary uppercase text-sm">{erp.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 mb-6">Conector ERP oficial NEXTCON.</p>
                  <Button variant="outline" className="w-full h-10 text-[10px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary/5">
                    Configurar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-primary">
                  <Tags className="size-5 text-[#f59e0b]" /> Tabelas de Preço (Venda)
                </CardTitle>
                <CardDescription>Defina quanto seus clientes pagam por vida ou serviço.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-2xl hover:bg-gray-50 transition-all cursor-pointer flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-sm text-[#090e24]">Tabela Padrão Nextcon 2025</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Global • 42 Itens</p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-[#f59e0b]" />
                </div>
                <div className="p-4 border rounded-2xl border-[#f59e0b] bg-[#f59e0b]/5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-[#090e24]">Acordo VIP: Transportes Rapidez</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Especial • 12 Itens</p>
                  </div>
                  <Badge className="bg-[#f59e0b] text-[#090e24] font-black text-[8px]">Personalizada</Badge>
                </div>
                <Button className="w-full bg-[#090e24] font-black h-12 gap-2 uppercase text-[10px] tracking-widest">
                  <Percent className="size-4" /> Reajuste em Massa (IPCA)
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-primary">
                  <CreditCard className="size-5 text-primary" /> Custo de Exames (Compra)
                </CardTitle>
                <CardDescription>Monitoramento de custos da rede credenciada.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-xs font-bold text-muted-foreground">Exame Clínico (ASO)</span>
                    <span className="font-black text-sm">R$ 25,00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-xs font-bold text-muted-foreground">Audiometria Tonal</span>
                    <span className="font-black text-sm">R$ 18,00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-xs font-bold text-muted-foreground">PGR (Anual / Unidade)</span>
                    <span className="font-black text-sm">R$ 450,00</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Margem Operacional</p>
                  <p className="text-lg font-black text-emerald-600">82% <span className="text-[10px] font-medium">(Média do Mês)</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
