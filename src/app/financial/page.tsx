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
  Calendar
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
  Cell
} from 'recharts'
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { analyzeFiscalScenario } from "@/ai/flows/fiscal-intelligence-flow"

const cashFlowData = [
  { day: '01/02', entradas: 45000, saidas: 32000, saldo: 13000 },
  { day: '05/02', entradas: 52000, saidas: 28000, saldo: 37000 },
  { day: '10/02', entradas: 38000, saidas: 45000, saldo: 30000 },
  { day: '15/02', entradas: 65000, saidas: 31000, saldo: 64000 },
  { day: '20/02', entradas: 42000, saidas: 22000, saldo: 84000 },
  { day: '25/02', entradas: 58000, saidas: 35000, saldo: 107000 },
]

const topProductsData = [
  { name: 'PGR (NR-01)', value: 120, color: '#003366' },
  { name: 'PCMSO (NR-07)', value: 98, color: '#0055A4' },
  { name: 'LTCAT', value: 75, color: '#10B981' },
  { name: 'Treinamento NR-35', value: 64, color: '#f59e0b' },
  { name: 'Atestado Médico', value: 45, color: '#94a3b8' },
]

export default function FinancialModule() {
  const [activeTab, setActiveTab] = React.useState("cashflow")
  const { toast } = useToast()
  const [isAnalyzingFiscal, setIsAnalyzingFiscal] = React.useState(false)
  const [fiscalAiResult, setFiscalFiscalAiResult] = React.useState<any>(null)

  // Filtros Avançados
  const [filterAccount, setFilterAccount] = React.useState("all")
  const [filterClient, setFilterClient] = React.useState("all")
  const [filterPeriod, setFilterPeriod] = React.useState("30")

  const handleAiFiscalAnalysis = async () => {
    setIsAnalyzingFiscal(true)
    try {
      const result = await analyzeFiscalScenario({
        companySegment: "Serviços de Engenharia e Saúde",
        location: "Curitiba - PR",
        monthlyRevenue: 150000
      })
      setFiscalFiscalAiResult(result)
      toast({ title: "Análise Fiscal Concluída", description: "O cenário 2026 foi processado pela NAI." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na IA Fiscal" })
    } finally {
      setIsAnalyzingFiscal(false)
    }
  }

  const handleContractAction = (action: string, id: string) => {
    toast({
      title: "Ação Processada",
      description: `O contrato/OS ${id} foi ${action} com sucesso.`
    })
  }

  const summary = [
    { title: "Saldo em Caixa", amount: "R$ 284.950,00", trend: "+12%", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "A Receber (Mês)", amount: "R$ 142.500,00", trend: "Estável", icon: ArrowUpRight, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "A Pagar (Rede)", amount: "R$ 58.200,00", trend: "-5%", icon: ArrowDownLeft, color: "text-red-600", bg: "bg-red-50" },
    { title: "IBS/CBS Provisionado", amount: "R$ 1.425,00", trend: "0.1%/0.9%", icon: Scale, color: "text-amber-600", bg: "bg-amber-50" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Gestão Financeira & Operacional 2026</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Controle tático de fluxo, contratos e performance comercial.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary text-primary h-11 px-6 rounded-xl font-bold uppercase text-[10px]">
            <Download className="size-4" /> Exportar DRE
          </Button>
          <Button className="bg-accent text-primary hover:bg-accent/90 gap-2 h-11 px-6 shadow-lg font-black uppercase text-[10px] tracking-widest rounded-xl">
            <Plus className="size-4" /> Nova Operação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter">{item.trend}</Badge>
                </div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.title}</p>
                <h2 className="text-2xl font-black text-primary font-headline">{item.amount}</h2>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-muted/50 p-1 rounded-2xl h-16">
          <TabsTrigger value="cashflow" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <TrendingUp className="size-4" /> Fluxo Caixa
          </TabsTrigger>
          <TabsTrigger value="contracts" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <FileText className="size-4" /> Contratos/OS
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Receipt className="size-4" /> Pagar/Receber
          </TabsTrigger>
          <TabsTrigger value="bi" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <BarChart3 className="size-4" /> BI Vendas
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Scale className="size-4" /> Fiscal
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Zap className="size-4" /> Bancos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                  <CardTitle className="text-xl font-headline font-black text-primary uppercase">Saldo Previsto e Filtros</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Consulta por Conta, Cliente e Período.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select value={filterAccount} onValueChange={setFilterAccount}>
                    <SelectTrigger className="w-48 bg-white h-11 text-[10px] font-black uppercase border-none shadow-sm">
                      <Landmark className="size-3.5 mr-2" />
                      <SelectValue placeholder="Conta Corrente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Contas</SelectItem>
                      <SelectItem value="itau">Itaú (Matriz)</SelectItem>
                      <SelectItem value="inter">Inter (Op.)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-40 bg-white h-11 text-[10px] font-black uppercase border-none shadow-sm">
                      <Calendar className="size-3.5 mr-2" />
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Próx. 7 dias</SelectItem>
                      <SelectItem value="30">Próx. 30 dias</SelectItem>
                      <SelectItem value="90">Próx. 90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="entradas" stroke="#10B981" fillOpacity={1} fill="url(#colorEntradas)" strokeWidth={3} />
                  <Area type="monotone" dataKey="saidas" stroke="#EF4444" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-6 px-8">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Gestão de Vendas & Serviços</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Controle de Ciclo de Vida de Contratos e OS.</CardDescription>
              </div>
              <Button className="bg-primary text-white h-11 gap-2 rounded-xl font-black uppercase text-[10px] tracking-widest">
                <Plus className="size-4" /> Novo Contrato/OS
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8">ID / Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vencimento/Início</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-8">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "CON-8439", type: "Contrato Anual", client: "NATIVA EMPREENDIMENTOS", date: "15/02/2026", val: "R$ 45.000", status: "Ativo" },
                    { id: "OS-1022", type: "Ordem de Serviço", client: "TIMENOW GESTÃO", date: "18/02/2026", val: "R$ 4.200", status: "Pendente" },
                    { id: "CON-8438", type: "Contrato Mensal", client: "BRITÂNIA ELETRO", date: "12/02/2026", val: "R$ 8.900", status: "Suspenso" },
                  ].map((item, i) => (
                    <TableRow key={i} className="hover:bg-slate-50 transition-colors group">
                      <TableCell className="pl-8">
                        <div>
                          <p className="font-black text-xs text-primary">{item.id}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold">{item.type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-primary">{item.client}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">{item.date}</TableCell>
                      <TableCell className="font-black text-xs text-primary">{item.val}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-[8px] font-black uppercase border-none", 
                          item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'Pendente' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        )}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl border-none shadow-2xl">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400">Operações</DropdownMenuLabel>
                            {item.status === 'Pendente' && (
                              <DropdownMenuItem onClick={() => handleContractAction('ativado', item.id)} className="gap-3 cursor-pointer text-xs font-bold text-emerald-600">
                                <PlayCircle className="size-4" /> Ativar e Faturar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-3 cursor-pointer text-xs font-bold">
                              <FileText className="size-4 opacity-50" /> Consultar/Recibo
                            </DropdownMenuItem>
                            {item.type === 'Ordem de Serviço' && (
                              <DropdownMenuItem onClick={() => handleContractAction('duplicado', item.id)} className="gap-3 cursor-pointer text-xs font-bold">
                                <Copy className="size-4 opacity-50" /> Duplicar OS
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleContractAction('suspenso', item.id)} className="gap-3 cursor-pointer text-xs font-bold text-amber-600">
                              <PauseCircle className="size-4" /> Suspender
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleContractAction('cancelado', item.id)} className="gap-3 cursor-pointer text-xs font-bold text-red-600">
                              <XCircle className="size-4" /> Cancelar
                            </DropdownMenuItem>
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

        <TabsContent value="bi" className="mt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between py-6 px-8">
                <div>
                  <CardTitle className="text-xl font-headline font-black text-primary uppercase">Performance de Produtos</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Produtos mais vendidos por Cliente e Período.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32 bg-white h-9 text-[10px] font-black uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-8 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} width={120} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {topProductsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-[#090e24] text-white border-none p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><BarChart3 className="size-48 text-accent" /></div>
              <CardTitle className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-6 flex items-center gap-2">
                <TrendingUp className="size-4" /> Insight Comercial
              </CardTitle>
              <div className="space-y-6 relative z-10">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-white/40 uppercase mb-2">Maior Ticket Médio</p>
                  <p className="text-2xl font-black text-white">NATIVA EMPREENDIMENTOS</p>
                  <p className="text-[10px] mt-1 text-accent font-bold">R$ 12.400 /mês</p>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-white/40 uppercase mb-2">Serviço com Maior Margem</p>
                  <p className="text-xl font-black text-white">Auditoria eSocial (NAI)</p>
                  <Progress value={85} className="h-1.5 bg-white/10 mt-3" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fiscal" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="card-shadow border-none bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 border-b pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary text-white rounded-2xl">
                        <FileText className="size-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-headline font-black text-primary uppercase">Emissão de NF-e (Homologação)</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase text-slate-400">Ambiente de Testes para Transmissão Fiscal 2026.</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 border-none px-3 font-black">TESTE: IBS/CBS</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tipo de Operação</label>
                      <Input value="Prestação de Serviço (SST)" readOnly className="bg-slate-50 border-none h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Finalidade da NF-e</label>
                      <Input value="1 - NF-e Normal" readOnly className="bg-slate-50 border-none h-12 font-bold" />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <h4 className="text-sm font-black text-primary uppercase mb-4 flex items-center gap-2">
                      <Settings2 className="size-4" /> Novos Tributos (Cenário 2026)
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">IBS (Estadual)</p>
                        <p className="text-lg font-black text-primary">0,1% <span className="text-[10px] opacity-40">Testes</span></p>
                      </div>
                      <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">CBS (Federal)</p>
                        <p className="text-lg font-black text-primary">0,9% <span className="text-[10px] opacity-40">Testes</span></p>
                      </div>
                      <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">ISS Municipal</p>
                        <p className="text-lg font-black text-primary">5,0% <span className="text-[10px] opacity-40">Padrão</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button className="flex-1 h-14 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl">
                      Transmitir NF-e Homologação
                    </Button>
                    <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest border-primary/10">
                      Visualizar XML
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-[#090e24] text-white border-none p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5"><Sparkles className="size-48 text-accent" /></div>
                <CardHeader className="p-0 mb-6 relative z-10">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                    <Sparkles className="size-4" /> IA Fiscal Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6 relative z-10">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-white/40 uppercase mb-3">Simulação Tributária Reformada</p>
                    <p className="text-xs leading-relaxed opacity-80 italic">
                      "Utilize a NAI para prever o impacto da CBS e IBS em seus contratos de prestação de serviço recorrente."
                    </p>
                  </div>
                  
                  {fiscalAiResult && (
                    <div className="p-5 bg-accent/10 rounded-2xl border border-accent/20 animate-in zoom-in-95">
                      <p className="text-[10px] font-black text-accent uppercase mb-2">Insight Estratégico:</p>
                      <p className="text-xs font-bold text-white leading-relaxed">{fiscalAiResult.analysis}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="text-[9px] font-black uppercase text-accent/60">IBS Projetado: {fiscalAiResult.suggestedRates.ibs}%</div>
                        <div className="text-[9px] font-black uppercase text-accent/60">CBS Projetado: {fiscalAiResult.suggestedRates.cbs}%</div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleAiFiscalAnalysis}
                    disabled={isAnalyzingFiscal}
                    className="w-full h-14 bg-white text-primary font-black uppercase text-[10px] rounded-xl shadow-xl hover:bg-slate-100 transition-all gap-2"
                  >
                    {isAnalyzingFiscal ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-accent" />}
                    Analisar Cenário Fiscal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-6 px-8">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Contas a Liquidar</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Faturas de clientes e pagamentos de rede credenciada.</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input placeholder="Buscar por cliente ou documento..." className="pl-10 h-11 bg-white border-none rounded-xl shadow-inner text-xs" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8">Entidade</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status Banco</TableHead>
                    <TableHead className="text-right pr-8">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { client: "NATIVA EMPREENDIMENTOS", date: "15/02", val: "R$ 18.450", status: "Confirmado", color: "text-emerald-600" },
                    { client: "CLÍNICA SQV MATRIZ", date: "18/02", val: "R$ 4.200", status: "Agendado", color: "text-blue-600" },
                    { client: "TIMENOW GESTÃO", date: "12/02", val: "R$ 32.100", status: "Atrasado", color: "text-red-600" },
                  ].map((inv, i) => (
                    <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center font-black text-[10px] text-primary">
                            {inv.client.substring(0, 2)}
                          </div>
                          <span className="font-bold text-xs text-primary">{inv.client}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">{inv.date}</TableCell>
                      <TableCell className="font-black text-xs text-primary">{inv.val}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-[8px] font-black uppercase border-none", 
                          inv.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-700' :
                          inv.status === 'Agendado' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        )}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                          <RefreshCw className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Banco Itaú", status: "Conectado", type: "Automatizado", icon: Landmark },
              { name: "Bradesco", status: "Conectado", type: "Open Banking", icon: Landmark },
              { name: "Santander", status: "Pendente", type: "API Direta", icon: Landmark },
              { name: "Banco Inter", status: "Conectado", type: "Automatizado", icon: Landmark },
            ].map((bank) => (
              <Card key={bank.name} className="border-none shadow-xl hover:ring-2 ring-accent/20 transition-all bg-white rounded-[2rem] overflow-hidden group">
                <CardContent className="pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <bank.icon className="size-7 text-accent" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <div className={cn("size-2 rounded-full", bank.status === 'Conectado' ? 'bg-accent animate-pulse' : 'bg-slate-300')}></div>
                        <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">{bank.status}</span>
                      </div>
                      <Badge className="bg-primary/5 text-primary text-[8px] border-none font-black uppercase">{bank.type}</Badge>
                    </div>
                  </div>
                  <h3 className="font-black text-primary uppercase text-sm mb-1">{bank.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight mb-6">Integração bancária via Open Finance NAI.</p>
                  <Button variant="outline" className="w-full h-11 text-[9px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary hover:text-white transition-all rounded-xl">
                    Sincronizar Agora
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
