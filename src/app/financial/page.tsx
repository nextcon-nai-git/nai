"use client"

import * as React from "react"
import { 
  DollarSign, 
  Receipt, 
  Tags, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Database, 
  Percent, 
  Plug, 
  Download,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  CreditCard,
  History
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

export default function FinancialModule() {
  const [activeTab, setActiveTab] = React.useState("billing")

  const summary = [
    { title: "A Receber (Mês)", amount: "R$ 142.500,00", trend: "+12%", icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "A Pagar (Rede)", amount: "R$ 58.200,00", trend: "-5%", icon: ArrowDownLeft, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Inadimplência", amount: "2.4%", trend: "Estável", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { title: "Ticket Médio/Vida", amount: "R$ 18,40", trend: "+3%", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
  ]

  const recentInvoices = [
    { id: "INV-2025-001", client: "Transportes Rapidez", date: "10/02/2025", amount: "R$ 4.250,00", status: "Pago" },
    { id: "INV-2025-002", client: "Metalúrgica Norte", date: "12/02/2025", amount: "R$ 8.900,00", status: "Pendente" },
    { id: "INV-2025-003", client: "Logística Express", date: "15/02/2025", amount: "R$ 2.100,00", status: "Atrasado" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Módulo Financeiro NEXTCON</h1>
          <p className="text-muted-foreground">Gestão de faturamento, precificação e integração ERP.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary text-primary">
            <Download className="size-4" /> Exportar Tabelas
          </Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2 shadow-lg shadow-accent/20">
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
              <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Gestão de Cobrança</CardTitle>
                  <CardDescription>Faturas emitidas e status de recebimento.</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input placeholder="Buscar fatura ou cliente..." className="pl-9 bg-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-black text-[10px] uppercase">Fatura</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Cliente</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Vencimento</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Valor</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                        <TableCell className="font-bold">{inv.client}</TableCell>
                        <TableCell className="text-xs">{inv.date}</TableCell>
                        <TableCell className="font-bold">{inv.amount}</TableCell>
                        <TableCell>
                          <Badge className={
                            inv.status === 'Pago' ? 'bg-emerald-100 text-emerald-700 border-none' :
                            inv.status === 'Pendente' ? 'bg-amber-100 text-amber-700 border-none' :
                            'bg-red-100 text-red-700 border-none'
                          }>
                            {inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-[#090e24] text-white">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase text-accent tracking-widest">Auditoria de Contas</CardTitle>
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
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <p className="text-[10px] text-accent font-black uppercase">Pendência de Auditoria</p>
                  <p className="text-xs leading-relaxed opacity-80 italic">
                    Existem 258 eventos de saúde do mês anterior que ainda não foram convertidos em faturas.
                  </p>
                  <Button variant="outline" className="w-full text-[10px] font-black h-8 mt-2 text-white border-white/20 hover:bg-white/10">
                    Conciliar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tags className="size-5 text-accent" /> Tabelas de Preço (Venda)
                </CardTitle>
                <CardDescription>Configure quanto seus clientes pagam por serviço.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-xl hover:bg-muted/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">Tabela Padrão Nextcon 2025</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Global • 42 Itens</p>
                    </div>
                    <Button variant="ghost" size="icon"><ArrowUpRight className="size-4" /></Button>
                  </div>
                </div>
                <div className="p-4 border rounded-xl border-accent bg-accent/5 hover:bg-accent/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">Acordo Especial: Transportes Rapidez</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Cliente VIP • 12 Itens Customizados</p>
                    </div>
                    <Badge className="bg-accent text-white border-none">Personalizada</Badge>
                  </div>
                </div>
                <Button className="w-full bg-primary font-bold h-12 gap-2">
                  <Percent className="size-4" /> Reajuste em Massa (IGPM/IPCA)
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="size-5 text-primary" /> Custo de Exames (Compra)
                </CardTitle>
                <CardDescription>Quanto você paga para a rede credenciada.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px] uppercase font-black">Serviço</TableHead>
                      <TableHead className="text-[10px] uppercase font-black">Custo Médio</TableHead>
                      <TableHead className="text-[10px] uppercase font-black text-right">Margem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs">Exame Clínico (ASO)</TableCell>
                      <TableCell className="font-bold">R$ 25,00</TableCell>
                      <TableCell className="text-right text-emerald-600 font-bold">120%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs">Audiometria</TableCell>
                      <TableCell className="font-bold">R$ 18,00</TableCell>
                      <TableCell className="text-right text-emerald-600 font-bold">85%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs">PGR Anual</TableCell>
                      <TableCell className="font-bold">R$ 450,00</TableCell>
                      <TableCell className="text-right text-emerald-600 font-bold">210%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cadastros" className="mt-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Catálogo de Produtos e Serviços</CardTitle>
                <CardDescription>Definição base de entregáveis da Nextcon.</CardDescription>
              </div>
              <Button className="bg-[#090e24] gap-2">
                <Plus className="size-4" /> Novo Item
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-black text-[10px] uppercase">Grupo</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Nome do Serviço</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Descrição</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><Badge variant="outline">Saúde</Badge></TableCell>
                    <TableCell className="font-bold">PCMSO (NR-07)</TableCell>
                    <TableCell className="text-xs text-muted-foreground">Programa de Controle Médico de Saúde Ocupacional.</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon"><History className="size-4" /></Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Badge variant="outline">Engenharia</Badge></TableCell>
                    <TableCell className="font-bold">LTCAT</TableCell>
                    <TableCell className="text-xs text-muted-foreground">Laudo Técnico das Condições Ambientais de Trabalho.</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon"><History className="size-4" /></Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Conta Azul", logo: "CA", desc: "Sincronize faturamento e status de pagamento.", status: "Conectado" },
              { name: "Omie", logo: "OM", desc: "Integração total com ERP Omie.", status: "Disponível" },
              { name: "Questor", logo: "QS", desc: "Envio automático de eventos financeiros.", status: "Pendente" },
            ].map((app) => (
              <Card key={app.name} className="border-none shadow-lg hover:ring-2 ring-primary/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 bg-primary/5 rounded-xl flex items-center justify-center font-black text-primary border border-primary/10">
                      {app.logo}
                    </div>
                    <div>
                      <h3 className="font-bold">{app.name}</h3>
                      <Badge className={app.status === 'Conectado' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}>
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {app.desc}
                  </p>
                  <Button variant={app.status === 'Conectado' ? 'outline' : 'default'} className="w-full">
                    {app.status === 'Conectado' ? 'Configurar' : 'Conectar'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}