
"use client"

import * as React from "react"
import { 
  DollarSign, 
  Receipt, 
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
  RefreshCw,
  TrendingUp,
  Landmark,
  ShoppingCart,
  Package,
  Zap,
  BarChart3,
  Wallet,
  FileText,
  Scale,
  Sparkles,
  Loader2,
  Settings2,
  ShieldCheck,
  PauseCircle,
  XCircle,
  Copy,
  PlayCircle,
  Filter,
  ArrowRight,
  MoreVertical,
  Calendar,
  Layers,
  ShieldAlert,
  HelpCircle,
  Play,
  Briefcase,
  Users,
  FileBarChart,
  UserCheck,
  PieChart
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { analyzeFiscalScenario } from "@/ai/flows/fiscal-intelligence-flow"
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase"
import { doc, collectionGroup, query, orderBy } from "firebase/firestore"
import { DRE_2025_HISTORY, REAL_CONTRACTS, DRE_2026_DATA } from "@/lib/real-data"

const cashFlowData = [
  { day: '01/02', entradas: 45000, saidas: 32000, saldo: 13000 },
  { day: '05/02', entradas: 52000, saidas: 28000, saldo: 37000 },
  { day: '10/02', entradas: 38000, saidas: 45000, saldo: 30000 },
  { day: '15/02', entradas: 65000, saidas: 31000, saldo: 64000 },
  { day: '20/02', entradas: 42000, saidas: 22000, saldo: 84000 },
  { day: '25/02', entradas: 58000, saidas: 35000, saldo: 107000 },
]

export default function FinancialModule() {
  const [activeTab, setActiveTab] = React.useState("contracts")
  const { toast } = useToast()
  const db = useFirestore()
  const [isAnalyzingFiscal, setIsAnalyzingFiscal] = React.useState(false)
  const [fiscalAiResult, setFiscalFiscalAiResult] = React.useState<any>(null)
  const [dreYear, setDreYear] = React.useState("2026")
  
  const [remittanceType, setRemittanceType] = React.useState("240")
  const [convenioCodes, setConvenioCodes] = React.useState({
    santander: "",
    itau: "",
    bradesco: "",
    bb: ""
  })

  const dre2025Ref = useMemoFirebase(() => {
    if (!db) return null
    return doc(db, "financialStats", "DRE_2025_CONSOLIDATED")
  }, [db])
  const { data: remoteDre2025 } = useDoc(dre2025Ref)

  const contractsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collectionGroup(db, "contracts"), orderBy("value", "desc"))
  }, [db])
  const { data: uploadedContracts, isLoading: loadingContracts } = useCollection(contractsQuery)

  const contracts = uploadedContracts?.length ? uploadedContracts : REAL_CONTRACTS;

  const totalContractValue = React.useMemo(() => {
    return contracts.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0)
  }, [contracts])

  const activeDreData = React.useMemo(() => {
    if (dreYear === "2025") {
      return remoteDre2025?.data || DRE_2025_HISTORY;
    }
    return DRE_2026_DATA;
  }, [dreYear, remoteDre2025])

  const handleAiFiscalAnalysis = async () => {
    setIsAnalyzingFiscal(true)
    try {
      const result = await analyzeFiscalScenario({
        companySegment: "Serviços de Engenharia e Saúde",
        location: "Curitiba - PR",
        monthlyRevenue: 150000
      })
      setFiscalFiscalAiResult(result)
      toast({ title: "Análise Fiscal Concluída" })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na IA Fiscal" })
    } finally {
      setIsAnalyzingFiscal(false)
    }
  }

  const handleSaveConvenio = (bank: string) => {
    toast({
      title: "Configuração Salva",
      description: `Código de convênio para ${bank.toUpperCase()} atualizado.`
    })
  }

  const summary = [
    { title: "Valor Total Contratos", amount: totalContractValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: "Conquistado", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Saldo em Caixa", amount: "R$ 284.950,00", trend: "+12%", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "A Receber (Parcelado)", amount: "R$ 142.500,00", trend: "Desdobrado", icon: ArrowUpRight, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Consolidação Multi-app", amount: "Multi CNPJs", trend: "Sincronizado", icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  const reportCategories = [
    { 
      title: "Contas a Pagar & Receber", 
      icon: Receipt, 
      items: [
        "Contas a Pagar em Aberto", 
        "Pagamentos Realizados", 
        "Contas a Receber em Aberto", 
        "Recebimentos Realizados",
        "Atrasadas (Geral)"
      ] 
    },
    { 
      title: "Fluxo de Caixa & Performance", 
      icon: TrendingUp, 
      items: [
        "Fluxo por Categoria", 
        "Fluxo por Cliente/Fornecedor", 
        "Resumo de Caixa", 
        "DRE (Competência)",
        "Resumo Executivo de Finanças"
      ] 
    },
    { 
      title: "Cadastros & Atividades", 
      icon: Users, 
      items: [
        "Clientes e Fornecedores", 
        "Atividades dos Usuários (Logs)", 
        "Comissão de Vendas", 
        "Movimentação (Últimos 12 Meses)"
      ] 
    },
    { 
      title: "Filtros Avançados", 
      icon: Filter, 
      items: [
        "Por Período Customizado", 
        "Por Departamento", 
        "Por Vendedor", 
        "Por Projeto"
      ] 
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">ERP Financeiro Nextcon</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest">Motor de Inteligência Fiscal, Bancária e Governança 2026.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary text-primary h-11 px-6 rounded-xl font-bold uppercase text-[10px]" asChild>
            <a href="#" className="flex items-center gap-2">
              <Play className="size-3.5 fill-current" /> Vídeos Tutoriais
            </a>
          </Button>
          <Button className="bg-accent text-primary hover:bg-accent/90 gap-2 h-11 px-6 shadow-lg font-black uppercase text-[10px] tracking-widest rounded-xl">
            <Plus className="size-4" /> Novo Lançamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter">{item.trend}</Badge>
                </div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.title}</p>
                <h2 className="text-xl font-black text-primary font-headline">{item.amount}</h2>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <TabsList className="flex w-fit bg-muted/50 p-1 rounded-2xl h-16">
            <TabsTrigger value="contracts" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <Briefcase className="size-4" /> Contratos
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <TrendingUp className="size-4" /> Fluxo/Caixa
            </TabsTrigger>
            <TabsTrigger value="dre" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <BarChart3 className="size-4" /> DRE
            </TabsTrigger>
            <TabsTrigger value="receivables" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <Receipt className="size-4" /> Receber
            </TabsTrigger>
            <TabsTrigger value="payables" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <ArrowDownLeft className="size-4" /> Pagar
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <FileBarChart className="size-4" /> Relatórios
            </TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <Landmark className="size-4" /> Bancário
            </TabsTrigger>
            <TabsTrigger value="fiscal" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 shrink-0">
              <Scale className="size-4" /> Fiscal
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="contracts" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Contratos & OS</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Gestão de ciclo de vida e faturamento.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-10 text-[9px] font-black uppercase">Faturar Selecionados</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Cliente / Solução</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-8">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((item, i) => (
                    <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="pl-8">
                        <p className="font-black text-xs text-primary">{item.companyName || "Cliente"}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">{item.title}</p>
                      </TableCell>
                      <TableCell className="font-black text-xs text-primary">
                        {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase border-none">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="size-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-xs font-bold gap-2"><CheckCircle2 className="size-3 text-emerald-600" /> Ativar e Faturar</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold gap-2"><Copy className="size-3" /> Duplicar OS</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold gap-2 text-destructive"><XCircle className="size-3" /> Suspender</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payables" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-red-50/30 border-b py-6 px-8">
              <CardTitle className="text-lg font-black text-red-900 uppercase">Contas a Pagar</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-red-700/60">Controle de saídas e fornecedores.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Fornecedor / Categoria</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-8">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { prov: "Clinica SQV", cat: "Rede Credenciada", date: "15/02/2026", val: "R$ 1.200", status: "Aguardando Aprovação" },
                    { prov: "Santander", cat: "Tarifas", date: "10/02/2026", val: "R$ 45,00", status: "Pago" },
                  ].map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-8">
                        <p className="font-black text-xs text-primary">{item.prov}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">{item.cat}</p>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{item.date}</TableCell>
                      <TableCell className="font-black text-xs text-red-600">-{item.val}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[8px] font-black uppercase">{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button size="sm" className="h-8 px-4 text-[9px] font-black uppercase">Aprovar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportCategories.map((cat) => (
              <Card key={cat.title} className="card-shadow border-none bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary text-white rounded-xl">
                      <cat.icon className="size-4" />
                    </div>
                    <CardTitle className="text-xs font-black uppercase tracking-tight text-primary leading-tight">
                      {cat.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-1">
                  {cat.items.map((item) => (
                    <button 
                      key={item}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all group flex items-center justify-between"
                    >
                      <span className="text-[10px] font-bold text-slate-600 group-hover:text-primary uppercase">{item}</span>
                      <Download className="size-3 text-slate-300 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><PieChart className="size-48 text-accent" /></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-accent tracking-widest">Resumo Executivo NAI</p>
                <h3 className="text-2xl font-black font-headline">Visão Macro de Performance</h3>
                <p className="text-sm text-white/60 leading-relaxed italic">"Baseado na movimentação dos últimos 12 meses, sua margem líquida cresceu 8.4% com a otimização tributária 2026."</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <ReportKpi label="EBITDA" value="+14.2%" trend="up" />
                <ReportKpi label="Inadimplência" value="2.1%" trend="down" />
                <ReportKpi label="ROI Segurança" value="94.8%" trend="up" />
                <ReportKpi label="Vendas SST" value="R$ 1.4M" trend="up" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8 border-b">
              <div className="flex justify-between items-end">
                <div>
                  <CardTitle className="text-xl font-headline font-black text-primary uppercase">Fluxo de Caixa Preditivo</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest">Saldo Previsto por Conta e Período.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="santander">
                    <SelectTrigger className="w-40 h-10 text-[10px] font-black uppercase"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="santander">Santander</SelectItem>
                      <SelectItem value="itau">Itaú</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tick={{fontSize: 10}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="entradas" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={3} />
                  <Area type="monotone" dataKey="saidas" stroke="#EF4444" fill="#EF4444" fillOpacity={0.05} strokeWidth={3} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dre" className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-emerald-50/50 pb-8 border-b">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                  <CardTitle className="text-xl font-headline font-black text-emerald-900 uppercase">Demonstrativo de Resultados (DRE)</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase text-emerald-700/60">Análise de competência consolidada.</CardDescription>
                </div>
                <Select value={dreYear} onValueChange={setDreYear}>
                  <SelectTrigger className="w-40 h-11 bg-white border-none shadow-sm text-xs font-bold">
                    <History className="size-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">Exercício 2026</SelectItem>
                    <SelectItem value="2025">Histórico 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeDreData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '20px'}} />
                    <Bar dataKey="receita" fill="#003366" radius={[4, 4, 0, 0]} name="Receita" />
                    <Bar dataKey="lucro" fill="#10B981" radius={[4, 4, 0, 0]} name="Lucro Líquido" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-[#EC1C24] text-white p-10">
                <div className="flex items-center gap-4 mb-4">
                  <Landmark className="size-10" />
                  <h3 className="text-2xl font-black uppercase tracking-tight">Banco Santander</h3>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Código de Convênio</label>
                  <Input 
                    placeholder="Ex: 1234567" 
                    value={convenioCodes.santander}
                    onChange={(e) => setConvenioCodes({...convenioCodes, santander: e.target.value})}
                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold"
                  />
                </div>
                <Button 
                  onClick={() => handleSaveConvenio('Santander')}
                  className="w-full h-16 bg-[#EC1C24] hover:bg-[#EC1C24]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                >
                  <Zap className="size-5" /> Salvar Santander
                </Button>
              </CardContent>
            </Card>

            <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-[#FF7000] text-white p-10">
                <div className="flex items-center gap-4 mb-4">
                  <Landmark className="size-10" />
                  <h3 className="text-2xl font-black uppercase tracking-tight">Banco Itaú</h3>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Código de Convênio (API)</label>
                  <Input 
                    placeholder="Ex: 987654" 
                    value={convenioCodes.itau}
                    onChange={(e) => setConvenioCodes({...convenioCodes, itau: e.target.value})}
                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold"
                  />
                </div>
                <Button 
                  onClick={() => handleSaveConvenio('Itaú')}
                  className="w-full h-16 bg-[#FF7000] hover:bg-[#FF7000]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                >
                  <Zap className="size-5" /> Salvar Itaú
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fiscal" className="mt-8 space-y-8">
          <Card className="card-shadow border-none bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-xl font-headline font-black text-primary uppercase">Cenário Fiscal (Homologação)</CardTitle>
                <Button 
                  onClick={handleAiFiscalAnalysis} 
                  disabled={isAnalyzingFiscal}
                  className="bg-accent text-primary font-black uppercase text-[10px] h-10 px-6 rounded-xl"
                >
                  {isAnalyzingFiscal ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
                  Analisar Reforma 2026
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IBS (Estadual/Muni.)</p>
                  <p className="text-3xl font-black text-primary">0,1%</p>
                  <Badge variant="outline" className="text-[8px] uppercase">Homologação</Badge>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CBS (Federal)</p>
                  <p className="text-3xl font-black text-primary">0,9%</p>
                  <Badge variant="outline" className="text-[8px] uppercase">Produção Restrita</Badge>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISS Municipal</p>
                  <p className="text-3xl font-black text-slate-300">5,0%</p>
                  <Badge variant="outline" className="text-[8px] uppercase">Alíquota Residual</Badge>
                </div>
              </div>

              {fiscalAiResult && (
                <div className="mt-8 p-6 bg-accent/5 rounded-3xl border border-accent/20 animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="size-5 text-accent" />
                    <h4 className="font-black text-primary uppercase text-sm">Análise NAI Intelligence</h4>
                  </div>
                  <p className="text-sm text-primary/80 leading-relaxed italic mb-4">
                    "{fiscalAiResult.analysis}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportKpi({ label, value, trend }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
      <p className="text-[9px] font-black text-white/40 uppercase mb-1">{label}</p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl font-black">{value}</span>
        {trend === 'up' ? <TrendingUp className="size-3 text-accent" /> : <ArrowDownLeft className="size-3 text-red-400" />}
      </div>
    </div>
  )
}
