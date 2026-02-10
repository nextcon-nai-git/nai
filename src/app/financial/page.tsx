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
  ShieldCheck
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
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
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

export default function FinancialModule() {
  const [activeTab, setActiveTab] = React.useState("cashflow")
  const { toast } = useToast()
  const [isAnalyzingFiscal, setIsAnalyzingFiscal] = React.useState(false)
  const [fiscalAiResult, setFiscalFiscalAiResult] = React.useState<any>(null)

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
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Gestão Financeira & Fiscal 2026</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Controle tático de fluxo, automação bancária e conformidade tributária.</p>
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50 p-1 rounded-2xl h-16">
          <TabsTrigger value="cashflow" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <TrendingUp className="size-4" /> Fluxo Caixa
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Receipt className="size-4" /> Pagar/Receber
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Scale className="size-4" /> Fiscal & NF-e
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <ShoppingCart className="size-4" /> Compras
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Zap className="size-4" /> Bancos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-headline font-black text-primary uppercase">Projeção de Fluxo NAI</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Análise de Entradas vs Saídas acumuladas.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 font-black">ENTRADAS: R$ 357k</Badge>
                  <Badge className="bg-red-100 text-red-700 border-none px-3 font-black">SAÍDAS: R$ 193k</Badge>
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

              <Card className="card-shadow border-none bg-white">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                    <History className="size-5" /> Registros e Recebimentos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="text-[10px] font-black uppercase py-4 pl-8">Doc / NF-e</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Cliente / Destinatário</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Valor (Bruto)</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-right pr-8">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { doc: "NF-e 8439", client: "NATIVA EMPREENDIMENTOS", val: "R$ 12.450", status: "Autorizada" },
                        { doc: "NFS-e 1022", client: "TIMENOW GESTÃO", val: "R$ 4.200", status: "Processando" },
                        { doc: "NF-e 8438", client: "BRITÂNIA ELETRO", val: "R$ 8.900", status: "Cancelada" },
                      ].map((nf, i) => (
                        <TableRow key={i}>
                          <TableCell className="pl-8 font-bold text-xs">{nf.doc}</TableCell>
                          <TableCell className="text-xs font-bold text-primary">{nf.client}</TableCell>
                          <TableCell className="text-xs font-black">{nf.val}</TableCell>
                          <TableCell className="text-right pr-8">
                            <Badge className={cn(
                              "text-[8px] font-black uppercase border-none",
                              nf.status === 'Autorizada' ? "bg-emerald-100 text-emerald-700" :
                              nf.status === 'Processando' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                            )}>
                              {nf.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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

              <Card className="card-shadow border-none bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-[10px] font-black uppercase text-blue-900 tracking-widest flex items-center gap-2">
                    <ShieldCheck className="size-4" /> Produção Restrita
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-800">Status Transmissão</span>
                    <Badge className="bg-emerald-500 text-white text-[8px] font-black uppercase border-none h-5">Ativo</Badge>
                  </div>
                  <Progress value={100} className="h-1.5 bg-blue-200" />
                  <p className="text-[9px] text-blue-700/70 font-medium leading-relaxed">
                    O envio de dados para NFS-e está operando em Produção Restrita. Todos os impostos são calculados com alíquotas de teste para validação do governo.
                  </p>
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

        <TabsContent value="orders" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-amber-50/50 border-b">
                <CardTitle className="text-xl font-headline font-black text-primary uppercase flex items-center gap-3">
                  <Package className="size-6 text-amber-600" /> Ordens de Compra & Estoque
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 text-[9px] font-black uppercase">
                    <TableRow>
                      <TableHead className="pl-8">Item / Mercadoria</TableHead>
                      <TableHead>Qtd Solicitada</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-right pr-8">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { item: "EPI: Capacete MSA Classe B", qty: "50 un", provider: "SST Suprimentos", status: "Em Trânsito" },
                      { item: "Dosímetro de Ruído Digital", qty: "02 un", provider: "InstruLab", status: "Aguardando Apr." },
                      { item: "Kit Primeiros Socorros NR-07", qty: "10 un", provider: "MedHealth", status: "Entregue" },
                    ].map((order, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-8 font-bold text-xs">{order.item}</TableCell>
                        <TableCell className="text-xs font-black text-primary">{order.qty}</TableCell>
                        <TableCell className="text-[10px] uppercase font-bold text-slate-400">{order.provider}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200">{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-[#090e24] text-white border-none p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><ShoppingCart className="size-48 text-accent" /></div>
              <CardTitle className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-6 flex items-center gap-2">
                <Zap className="size-4" /> Gestão de Ativos
              </CardTitle>
              <div className="space-y-6 relative z-10">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-white/40 uppercase mb-2">Valor Total em Trânsito</p>
                  <p className="text-3xl font-black text-white font-headline">R$ 12.400</p>
                </div>
                <Button className="w-full h-14 bg-white text-primary font-black uppercase text-[10px] rounded-xl shadow-xl hover:bg-slate-100 transition-all">
                  Nova Ordem de Compra
                </Button>
              </div>
            </Card>
          </div>
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
          
          <Card className="mt-8 border-none bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="size-24 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shrink-0">
                <CheckCircle2 className="size-12 text-accent" />
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left">
                <h3 className="text-xl font-black text-primary uppercase font-headline">Automatização de Pagamentos Ativa</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  A plataforma Nextcon agora realiza a liquidação automática de notas fiscais de prestadores assim que o ASO é validado pela NAI. Sem burocracia, sem erros de digitação.
                </p>
              </div>
              <Button className="h-14 px-10 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl">
                Configurar Regras de Automação
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
