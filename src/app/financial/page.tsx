
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
  Briefcase
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
import { DRE_2025_HISTORY, REAL_CONTRACTS } from "@/lib/real-data"

const cashFlowData = [
  { day: '01/02', entradas: 45000, saidas: 32000, saldo: 13000 },
  { day: '05/02', entradas: 52000, saidas: 28000, saldo: 37000 },
  { day: '10/02', entradas: 38000, saidas: 45000, saldo: 30000 },
  { day: '15/02', entradas: 65000, saidas: 31000, saldo: 64000 },
  { day: '20/02', entradas: 42000, saidas: 22000, saldo: 84000 },
  { day: '25/02', entradas: 58000, saidas: 35000, saldo: 107000 },
]

const dre2026Data = [
  { month: 'Set', receita: 120000, despesa: 80000, lucro: 40000 },
  { month: 'Out', receita: 145000, despesa: 85000, lucro: 60000 },
  { month: 'Nov', receita: 130000, despesa: 90000, lucro: 40000 },
  { month: 'Dez', receita: 180000, despesa: 110000, lucro: 70000 },
  { month: 'Jan', receita: 155000, despesa: 95000, lucro: 60000 },
  { month: 'Fev', receita: 165000, despesa: 98000, lucro: 67000 },
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

  // Busca contratos reais importados
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
    return dre2026Data;
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Gestão Financeira Corporativa</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest">ERP Integrado: Fluxo, DRE, Parcelamentos e Integração Bancária.</p>
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-muted/50 p-1 rounded-2xl h-16">
          <TabsTrigger value="contracts" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Briefcase className="size-4" /> Contratos
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <TrendingUp className="size-4" /> Fluxo/Caixa
          </TabsTrigger>
          <TabsTrigger value="dre" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <BarChart3 className="size-4" /> DRE (Comp.)
          </TabsTrigger>
          <TabsTrigger value="receivables" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Receipt className="size-4" /> Receber
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Landmark className="size-4" /> Bancário
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Scale className="size-4" /> Fiscal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Contratos Conquistados (Base Real)</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Gestão de soluções e faturamento recorrente.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-10 text-[9px] font-black uppercase">Relatório MEC</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Cliente / Solução</TableHead>
                    <TableHead>Valor Contrato</TableHead>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ArrowRight className="size-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8 h-20">
              <CardTitle className="text-xl font-headline font-black text-primary uppercase">Visão por Competência e Caixa</CardTitle>
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

        <TabsContent value="receivables" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8">
              <CardTitle className="text-lg font-black text-primary uppercase">Contas a Receber (Parcelados)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Cliente / Documento</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { client: "NATIVA EMPREENDIMENTOS", date: "15/02/2026", installment: "2 de 3", val: "R$ 4.500", status: "Pendente" },
                    { client: "TIMENOW GESTÃO", date: "18/02/2026", installment: "11 de 12", val: "R$ 12.200", status: "Atrasado" },
                  ].map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-8">
                        <p className="font-black text-xs text-primary">{item.client}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">FAT-8439</p>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">{item.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-black uppercase bg-slate-50">{item.installment}</Badge>
                      </TableCell>
                      <TableCell className="font-black text-xs text-primary">{item.val}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-[8px] font-black uppercase border-none", 
                          item.status === 'Recebido' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        )}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Santander */}
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

            {/* Itaú */}
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

            {/* Bradesco */}
            <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-[#CC092F] text-white p-10">
                <div className="flex items-center gap-4 mb-4">
                  <Landmark className="size-10" />
                  <h3 className="text-2xl font-black uppercase tracking-tight">Bradesco</h3>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Carteira de Cobrança</label>
                  <Input 
                    placeholder="Ex: 09" 
                    value={convenioCodes.bradesco}
                    onChange={(e) => setConvenioCodes({...convenioCodes, bradesco: e.target.value})}
                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold"
                  />
                </div>
                <Button 
                  onClick={() => handleSaveConvenio('Bradesco')}
                  className="w-full h-16 bg-[#CC092F] hover:bg-[#CC092F]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                >
                  <Zap className="size-5" /> Salvar Bradesco
                </Button>
              </CardContent>
            </Card>

            {/* Banco do Brasil */}
            <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-[#FCF000] text-[#0038A8] p-10 border-b border-blue-100">
                <div className="flex items-center gap-4 mb-4">
                  <Landmark className="size-10 text-[#0038A8]" />
                  <h3 className="text-2xl font-black uppercase tracking-tight">Banco do Brasil</h3>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Número do Convênio</label>
                  <Input 
                    placeholder="Ex: 3456789" 
                    value={convenioCodes.bb}
                    onChange={(e) => setConvenioCodes({...convenioCodes, bb: e.target.value})}
                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold"
                  />
                </div>
                <Button 
                  onClick={() => handleSaveConvenio('BB')}
                  className="w-full h-16 bg-[#0038A8] hover:bg-[#0038A8]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                >
                  <Zap className="size-5" /> Salvar Banco do Brasil
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-accent tracking-widest">Dicas de Eficiência:</p>
                      <ul className="space-y-1">
                        {fiscalAiResult.taxEfficiencyTips.map((tip: string, i: number) => (
                          <li key={i} className="text-xs font-medium text-slate-600 flex items-start gap-2">
                            <CheckCircle2 className="size-3 text-accent mt-0.5" /> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
