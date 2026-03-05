
"use client"

import * as React from "react"
import { 
  HardHat, 
  Building2, 
  Zap,
  FileText,
  Loader2,
  ShieldCheck,
  Target,
  Construction,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Activity,
  HeartPulse,
  Box,
  Scale,
  CheckCircle2,
  CalendarDays,
  DollarSign
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { collection } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const PROPOSAL_DATA = {
  client: "Dall Empreendimentos",
  project: "Obra Atmosphere",
  location: "Praia Brava, Itajaí/SC",
  cells: [
    {
      id: "sst",
      title: "Célula de Segurança (Campo)",
      icon: HardHat,
      description: "02 Técnicos de Segurança do Trabalho dedicados.",
      price: 23000.00,
      features: ["Presença Seg-Sáb", "Liberações PET/APR", "Treinamentos In Loco", "Engenheiro (Bonificado)"]
    },
    {
      id: "health",
      title: "Célula de Enfermagem (Ambulatório)",
      icon: HeartPulse,
      description: "02 Técnicos de Enfermagem (Regime 12x36h).",
      price: 23000.00,
      features: ["Primeiros Socorros", "Controle Absenteísmo", "Acompanhamento de Queixas", "Prontuário Digital"]
    },
    {
      id: "infra",
      title: "Infraestrutura e Insumos",
      icon: Box,
      description: "Locação de DEA, Maca, Oxigênio e Reposição Mensal.",
      price: 6500.00,
      features: ["Equipamentos de Ponta", "Manutenção Inclusa", "Insumos Descartáveis", "Kits de Emergência"]
    }
  ],
  roi: {
    payroll: 5000000,
    currentFap: 1.2,
    targetFap: 0.5,
    rat: 0.03
  }
};

export default function ConstructionProposalPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [isSaving, setIsSaving] = React.useState(false)

  const totalMonthly = PROPOSAL_DATA.cells.reduce((acc, curr) => acc + curr.price, 0);
  const currentTax = PROPOSAL_DATA.roi.payroll * PROPOSAL_DATA.roi.rat * PROPOSAL_DATA.roi.currentFap;
  const targetTax = PROPOSAL_DATA.roi.payroll * PROPOSAL_DATA.roi.rat * PROPOSAL_DATA.roi.targetFap;
  const annualSaving = currentTax - targetTax;

  const handleSendToClient = async () => {
    if (!db) return
    setIsSaving(true)
    try {
      const proposalRef = collection(db, "companies", "leads", "tasks")
      await addDocumentNonBlocking(proposalRef, {
        title: `Proposta Estratégica: ${PROPOSAL_DATA.project}`,
        companyName: PROPOSAL_DATA.client,
        type: 'comercial',
        status: 'sent',
        priority: 'critical',
        totalValue: totalMonthly,
        createdAt: new Date().toISOString(),
        metadata: {
          project: PROPOSAL_DATA.project,
          roi_saving: annualSaving
        },
        checklist: [
          { id: '1', text: 'Confirmar mobilização em 15 dias', checked: false, mandatory: true },
          { id: '2', text: 'Validar escala com RH Dall', checked: false, mandatory: true }
        ]
      })
      toast({ title: "Proposta Enviada!", description: "O dossiê foi protocolado no funil comercial." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary text-accent rounded-2xl shadow-xl">
              <Building2 className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary uppercase font-headline tracking-tight leading-none">Gestão Atmosphere</h1>
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] mt-1">{PROPOSAL_DATA.client} • ITACAÍ/SC</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-primary text-primary font-black uppercase text-[10px] h-12 px-6 rounded-xl">
            <FileText className="size-4 mr-2" /> PDF Executivo
          </Button>
          <Button onClick={handleSendToClient} disabled={isSaving} className="gradient-nextcon text-white font-black uppercase text-[10px] h-12 px-8 rounded-xl shadow-2xl gap-2">
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4 text-accent" />}
            Aprovar Mobilização
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {PROPOSAL_DATA.cells.map((cell) => {
              const Icon = cell.icon;
              return (
                <Card key={cell.id} className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn(
                          "p-3 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner",
                          cell.id === 'infra' ? 'bg-slate-50' : 'bg-primary/5'
                        )}>
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-primary uppercase text-sm">{cell.title}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{cell.description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {cell.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                            <CheckCircle2 className="size-3 text-emerald-500" /> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-8 flex flex-col items-center justify-center border-l md:w-64">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mensalidade</p>
                      <h4 className="text-xl font-black text-primary">
                        {cell.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </h4>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-8">
              <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <CalendarDays className="size-4" /> Planejamento de Escala (Presença Diária)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="pl-8 text-[9px] font-black uppercase">Turno</TableHead>
                    <TableHead className="text-[9px] font-black uppercase">Seg a Sex</TableHead>
                    <TableHead className="text-[9px] font-black uppercase">Sábado</TableHead>
                    <TableHead className="text-[9px] font-black uppercase pr-8">Domingo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="pl-8 font-black text-xs text-primary">Horário</TableCell>
                    <TableCell className="text-xs font-medium">07:00 às 19:00</TableCell>
                    <TableCell className="text-xs font-medium">07:00 às 13:00</TableCell>
                    <TableCell className="text-[10px] font-black uppercase text-slate-300 pr-8">Folga Geral</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 font-black text-xs text-primary">Equipe em Obra</TableCell>
                    <TableCell className="text-xs font-bold text-primary">1 TST + 1 Enfermeiro</TableCell>
                    <TableCell className="text-xs font-bold text-primary">1 TST + 1 Enfermeiro</TableCell>
                    <TableCell className="text-xs font-medium pr-8">---</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="p-6 bg-blue-50 italic text-[10px] font-bold text-slate-400 text-center">
                *Dimensionamento para 2 técnicos por célula (Total 4 prof.), garantindo revezamento 12x36h e conformidade legal.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <TrendingDown className="size-48 text-accent" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-xl text-primary shadow-lg shadow-accent/20">
                  <Scale className="size-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-accent">Análise de ROI (FAP)</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase text-white/40 mb-2">Economia Anual Estimada</p>
                  <h2 className="text-3xl font-black text-emerald-400 font-headline">
                    {annualSaving.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingDown className="size-3 text-emerald-400" />
                    <span className="text-[9px] font-bold uppercase text-white/60">Redução direta na folha anual</span>
                  </div>
                </div>

                <p className="text-[10px] leading-relaxed italic text-white/40 border-t border-white/5 pt-4">
                  "A economia gerada no FAP cobre cerca de 20% do investimento anual total nesta proposta."
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary text-white p-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Resumo Consolidado</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Equipe (2 TST + 2 Enf.)</span>
                  <span className="text-primary">R$ 46.000,00</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Infra e Insumos Full</span>
                  <span className="text-primary">R$ 6.500,00</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Supervisão e IA</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[8px]">INCLUSO</Badge>
                </div>
              </div>

              <div className="pt-6 border-t border-dashed">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Investimento Total</p>
                    <h2 className="text-2xl font-black text-primary font-headline">
                      {totalMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h2>
                  </div>
                  <Badge className="bg-primary text-white h-6 font-black text-[8px] uppercase">Mensal</Badge>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 items-start">
                <Sparkles className="size-4 text-primary shrink-0" />
                <p className="text-[9px] font-medium text-primary/70 leading-relaxed italic">
                  Próximos Passos: Assinatura do contrato e mobilização técnica em até 15 dias após aprovação.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
