
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
  Play
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
  Line
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

const dreData = [
  { month: 'Set', receita: 120000, despesa: 80000, lucro: 40000 },
  { month: 'Out', receita: 145000, despesa: 85000, lucro: 60000 },
  { month: 'Nov', receita: 130000, despesa: 90000, lucro: 40000 },
  { month: 'Dez', receita: 180000, despesa: 110000, lucro: 70000 },
  { month: 'Jan', receita: 155000, despesa: 95000, lucro: 60000 },
  { month: 'Fev', receita: 165000, despesa: 98000, lucro: 67000 },
]

export default function FinancialModule() {
  const [activeTab, setActiveTab] = React.useState("cashflow")
  const { toast } = useToast()
  const [isAnalyzingFiscal, setIsAnalyzingFiscal] = React.useState(false)
  const [fiscalAiResult, setFiscalFiscalAiResult] = React.useState<any>(null)
  
  // Estados para Santander e Remessa
  const [remittanceType, setRemittanceType] = React.useState("240")
  const [convenioCode, setConvenioCode] = React.useState("")

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

  const handleApproval = (id: string) => {
    toast({
      title: "Pagamento Aprovado",
      description: `O título ${id} foi liberado para agendamento bancário.`,
    })
  }

  const handleInstallmentActivation = (id: string) => {
    toast({
      title: "Parcelas Ativadas",
      description: `O desdobramento das parcelas do título ${id} foi realizado com sucesso.`,
    })
  }

  const summary = [
    { title: "Saldo em Caixa", amount: "R$ 284.950,00", trend: "+12%", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "A Receber (Parcelado)", amount: "R$ 142.500,00", trend: "Desdobrado", icon: ArrowUpRight, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Consolidação Multi-app", amount: "4 CNPJs", trend: "Sincronizado", icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Status Santander", amount: "Remessa 240", trend: "Online", icon: Landmark, color: "text-red-600", bg: "bg-red-50" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase leading-none">Gestão Financeira Corporativa</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest">ERP Integrado: Fluxo, DRE, Parcelamentos e Integração Santander.</p>
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
          <TabsTrigger value="cashflow" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <TrendingUp className="size-4" /> Fluxo/Caixa
          </TabsTrigger>
          <TabsTrigger value="dre" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <BarChart3 className="size-4" /> DRE (Comp.)
          </TabsTrigger>
          <TabsTrigger value="receivables" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Receipt className="size-4" /> Contas a Receber
          </TabsTrigger>
          <TabsTrigger value="payables" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <DollarSign className="size-4" /> Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Landmark className="size-4" /> Bancário
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Scale className="size-4" /> Fiscal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                  <CardTitle className="text-xl font-headline font-black text-primary uppercase">Visão por Competência e Caixa</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Consolidação Multi-app ativa.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48 bg-white h-11 text-[10px] font-black uppercase border-none shadow-sm">
                      <Layers className="size-3.5 mr-2" />
                      <SelectValue placeholder="Empresa (CNPJ)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Consolidado (Todas)</SelectItem>
                      <SelectItem value="nativa">Nativa Empreendimentos</SelectItem>
                      <SelectItem value="timenow">Time Now</SelectItem>
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
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
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
              <CardTitle className="text-xl font-headline font-black text-emerald-900 uppercase">Demonstrativo de Resultados (DRE)</CardTitle>
              <CardDescription className="text-xs font-bold uppercase text-emerald-700/60">Análise de competência: Receita Bruta, Impostos e Lucro Líquido.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] mb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dreData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Bar dataKey="receita" fill="#003366" radius={[4, 4, 0, 0]} name="Receita" />
                    <Bar dataKey="lucro" fill="#10B981" radius={[4, 4, 0, 0]} name="Lucro Líquido" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                <div className="p-4 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">EBITDA Anual</p>
                  <p className="text-2xl font-black text-primary">R$ 482.000</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Margem Líquida</p>
                  <p className="text-2xl font-black text-emerald-600">38.4%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Impostos Provisionados</p>
                  <p className="text-2xl font-black text-amber-600">R$ 18.250</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receivables" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Contas a Receber (Parcelados)</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Gestão de faturas e recorrências desdobradas.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-10 text-[9px] font-black uppercase">Baixa por Retorno</Button>
              </div>
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
                    <TableHead className="text-right pr-8">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { client: "NATIVA EMPREENDIMENTOS", date: "15/02/2026", installment: "2 de 3", val: "R$ 4.500", status: "Pendente" },
                    { client: "TIMENOW GESTÃO", date: "18/02/2026", installment: "11 de 12", val: "R$ 12.200", status: "Atrasado" },
                    { client: "BRITÂNIA ELETRO", date: "20/02/2026", installment: "Única", val: "R$ 8.900", status: "Recebido" },
                  ].map((item, i) => (
                    <TableRow key={i} className="hover:bg-slate-50 transition-colors">
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
                          item.status === 'Recebido' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'Pendente' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        )}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="size-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl">
                            <DropdownMenuItem onClick={() => handleInstallmentActivation('FAT-8439')} className="gap-3 text-xs font-bold">
                              <Layers className="size-4 opacity-50" /> Ativar Parcelamento
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 text-xs font-bold">
                              <FileText className="size-4 opacity-50" /> Visualizar Boleto
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 text-xs font-bold text-emerald-600">
                              <CheckCircle2 className="size-4" /> Baixa Manual
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

        <TabsContent value="payables" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-red-50/30 border-b py-6 px-8">
              <CardTitle className="text-lg font-black text-red-900 uppercase">Aprovação de Pagamentos</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-red-700/60">Fluxo de conferência e liberação para agendamento.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-red-50/10 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Fornecedor / Serviço</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status Aprovação</TableHead>
                    <TableHead className="text-right pr-8">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { prov: "CLÍNICA SQV MATRIZ", service: "Exames Complementares", date: "15/02", val: "R$ 4.200", status: "Pendente" },
                    { prov: "POSTO IPIRANGA", service: "Combustível Técnicos", date: "18/02", val: "R$ 850", status: "Aprovado" },
                  ].map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-8">
                        <p className="font-black text-xs text-primary">{item.prov}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">{item.service}</p>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">{item.date}</TableCell>
                      <TableCell className="font-black text-xs text-primary">{item.val}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-[8px] font-black uppercase border-none", 
                          item.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        )}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          onClick={() => handleApproval(item.prov)}
                          disabled={item.status === 'Aprovado'}
                          variant={item.status === 'Aprovado' ? "ghost" : "default"}
                          size="sm" 
                          className="h-9 px-4 rounded-xl text-[9px] font-black uppercase gap-2"
                        >
                          {item.status === 'Aprovado' ? <CheckCircle2 className="size-3.5" /> : <ShieldAlert className="size-3.5" />}
                          {item.status === 'Aprovado' ? "Liberado" : "Aprovar"}
                        </Button>
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
            <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden group hover:ring-2 ring-red-500/10 transition-all">
              <CardHeader className="bg-[#EC1C24] text-white p-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <Landmark className="size-10 text-[#EC1C24]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Banco Santander</h3>
                    <p className="text-xs font-bold text-white/60 uppercase">Cobrança Simples / CNAB 240</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tipo de Remessa</label>
                    <Select value={remittanceType} onValueChange={setRemittanceType}>
                      <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold shadow-inner">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="240">Layout 240 (Padrão)</SelectItem>
                        <SelectItem value="102">Layout 102 (Simplificado)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Código de Convênio</label>
                    <Input 
                      placeholder="Ex: 1234567" 
                      value={convenioCode}
                      onChange={(e) => setConvenioCode(e.target.value)}
                      className="h-14 bg-slate-50 border-none rounded-2xl font-bold shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-primary uppercase mb-3 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600" /> Configuração de Carteira
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    As cobranças serão geradas como <strong>"Cobrança Simples sem Protesto"</strong> conforme instrução técnica do banco.
                  </p>
                </div>

                <Button className="w-full h-16 bg-[#EC1C24] hover:bg-[#EC1C24]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
                  <Zap className="size-5" /> Salvar Credenciais Santander
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#090e24] text-white border-none p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles className="size-48 text-accent" /></div>
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-3">
                    <HelpCircle className="size-5" /> Assistência de Implantação
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-8 relative z-10">
                  <div className="space-y-6">
                    {[
                      { step: "1", text: "Organize sua planilha: Inclua o Nome do Cliente ao lado do CNPJ para facilitar o de-para do multiapp." },
                      { step: "2", text: "Valide parcelas incompletas: Utilize a ferramenta 'Ativar Parcelamento' em faturas importadas sem repetição automática." },
                      { step: "3", text: "Código de Convênio: Confirme com seu gerente Santander os dados da carteira de cobrança para habilitar o envio da remessa." }
                    ].map((item) => (
                      <div key={item.step} className="flex gap-5">
                        <div className="size-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-accent shrink-0 shadow-inner">{item.step}</div>
                        <p className="text-xs opacity-70 leading-relaxed font-medium">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                    <div className="p-5 bg-accent/10 rounded-2xl border border-accent/20 flex items-center gap-4">
                      <div className="size-12 bg-accent rounded-xl flex items-center justify-center">
                        <Play className="size-6 text-primary fill-current" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-accent mb-0.5 tracking-widest">Tutorial Santander</p>
                        <p className="text-[11px] font-medium opacity-60 italic">"Como gerar sua primeira remessa bancária no portal."</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
      </Tabs>
    </div>
  )
}
