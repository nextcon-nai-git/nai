'use client';

import * as React from 'react';
import { 
  Zap,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Clock,
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  HeartPulse,
  GraduationCap,
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Brain,
  ArrowUpRight,
  Users as UsersIcon,
  Network,
  Activity,
  BarChart3,
  Shield,
  XCircle,
  MapPin,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MedicalCopilot from '@/components/medical/medical-copilot'; 

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [saudacao, setSaudacao] = React.useState('');
  const [alertResolved, setAlertResolved] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  
  const [fapValue, setFapValue] = React.useState([0.74]);
  const [payroll, setPayroll] = React.useState(150000);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile, isLoading: loadingProfile } = useDoc(profileRef);

  const companyRef = useMemoFirebase(() => {
    if (!db || !profile?.companyId) return null;
    return doc(db, "companies", profile.companyId);
  }, [db, profile?.companyId]);
  const { data: company } = useDoc(companyRef);

  const isGlobalAdmin = React.useMemo(() => {
    if (loadingProfile || !profile) return false;
    const role = (profile.role || '').toUpperCase();
    return ['SUPER_ADMIN', 'ADMIN'].includes(role);
  }, [profile, loadingProfile]);

  React.useEffect(() => {
    setIsClient(true);
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');
  }, []);

  const potentialSavings = React.useMemo(() => {
    return (payroll * 0.02 * (1 - fapValue[0]) * 12);
  }, [payroll, fapValue]);

  if (!isClient) return null;

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Gestor';

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-primary" />
            <h1 className="text-2xl font-black text-primary tracking-tight font-headline uppercase leading-none">
              {loadingProfile ? (
                <Skeleton className="h-10 w-48" />
              ) : (
                <div className="flex flex-col gap-1">
                  <span>{saudacao}, <span className="text-slate-500">{displayName}</span></span>
                  {company?.name && (
                    <span className="text-xs font-bold text-slate-400 normal-case tracking-normal">
                      Unidade: {company.name}
                    </span>
                  )}
                </div>
              )}
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] ml-4">Cérebro NAI • Inteligência Nextcon 2026</p>
        </div>
        <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-5 h-11 border-none shadow-xl">
          {isGlobalAdmin ? 'GESTÃO INTERNA ATIVA' : 'CONFORMIDADE CLIENTE'}
        </Badge>
      </div>

      {!alertResolved && (
        <Card className="border-none bg-red-50 ring-2 ring-red-200 rounded-[2.5rem] overflow-hidden animate-in slide-in-from-top-4 duration-500 shadow-2xl shadow-red-200/20">
          <div className="flex flex-col lg:flex-row">
            <div className="p-8 lg:w-1/3 bg-red-600 text-white flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <ShieldAlert className="size-6 text-white animate-pulse" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Risco Crítico</h2>
              </div>
              <p className="text-sm font-bold text-red-100 leading-tight mb-6">
                Bloqueio preventivo automático para atividade em altura.
              </p>
              <div className="p-4 bg-black/10 rounded-2xl border border-white/10 italic text-[10px] font-medium">
                "Integração de Dados: Hipertensão detectada nos logs de triagem de ontem."
              </div>
            </div>
            
            <div className="p-8 lg:flex-1 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-100 pb-4">
                <div>
                  <Badge className="bg-red-100 text-red-700 border-none text-[8px] font-black uppercase tracking-widest mb-2">JOÃO SILVA • UNIDADE EM FOCO</Badge>
                  <h3 className="text-lg font-black text-primary uppercase">Posto de Trabalho Elevado</h3>
                </div>
                <Button variant="ghost" asChild className="h-8 text-[10px] font-black text-primary hover:bg-red-100">
                  <Link href="/medical/health-management">Ver Prontuário <ChevronRight className="size-3 ml-1" /></Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-sm">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Motivo do Alerta</p>
                  <p className="text-[11px] font-bold text-primary leading-tight">Spike de PA (160/100) registrado há 24h. Risco de síncope em altura.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-sm">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Impacto Financeiro</p>
                  <p className="text-[11px] font-bold text-emerald-600 leading-tight">Prevenção ativa preserva ROI estimado em passivo trabalhista.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => setAlertResolved(true)} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] h-11 px-6 rounded-xl gap-2 shadow-lg">
                  <CheckCircle2 className="size-4" /> Validar Remanejamento
                </Button>
                <Button variant="outline" asChild className="border-red-200 text-red-600 h-11 px-6 rounded-xl font-black uppercase text-[10px]">
                  <Link href="/medical/health-management">Refazer Triagem</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="pb-4 px-8 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary text-white rounded-xl shadow-inner">
                    <Brain className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-primary uppercase">Resumo Estratégico NAI</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Status de Blindagem Técnica e Tributária.</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 border-emerald-100 text-emerald-700 font-black text-[10px] h-8">S-2240 OK</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Economia FAP Projetada</p>
                  <h3 className="text-2xl font-black text-primary">R$ 142.500,00</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingDown className="size-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Efeito da Gestão Ativa</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Eficiência Operacional</p>
                  <h3 className="text-2xl font-black text-primary">94.2%</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle2 className="size-3 text-blue-500" />
                    <span className="text-[9px] font-bold text-blue-600 uppercase">Cronograma de NRs em dia</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Shield className="size-32 text-white" /></div>
                <div className="relative z-10 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Zap className="size-3 fill-current text-primary" /> Insight Preditivo NAI
                  </p>
                  <p className="text-sm italic font-medium leading-relaxed text-slate-300">
                    "A análise cruzada detectou tendência de absenteísmo. Recomendamos antecipar a vistoria ergonômica da NR-17 para mitigar o risco de novas liminares."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Vidas sob Vigilância" value="806" sub="Multitenant Ativo" icon={UsersIcon} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="ASOs Pendentes" value="12" sub="Próximos 30 dias" icon={HeartPulse} color="text-red-600" bg="bg-red-50" />
            <StatCard label="Check-ins Campo" value="142" sub="Logs Georeferenciados" icon={MapPin} color="text-emerald-600" bg="bg-emerald-50" />
          </div>
        </div>

        <div className="space-y-8">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 pb-6 p-8 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-xl shadow-lg">
                  <Calculator className="size-5" />
                </div>
                <CardTitle className="text-sm font-black text-primary uppercase tracking-tight">Simulador ROI NAI</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Fator FAP Alvo</label>
                  <span className="text-xl font-black text-primary tracking-tighter">{fapValue[0].toFixed(2)}</span>
                </div>
                <Slider value={fapValue} onValueChange={setFapValue} max={2} min={0.5} step={0.01} className="py-4" />
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Economia Anual Est.</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black font-headline tracking-tighter text-primary">
                    {Math.abs(potentialSavings).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </h3>
                  <ArrowUpRight className="size-5 text-primary" />
                </div>
              </div>
              <Button asChild className="w-full h-12 bg-primary text-white font-black uppercase text-[9px] tracking-widest rounded-xl">
                <Link href="/analytics">Análise de Performance</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conexões Ativas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Ambulatório Digital</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600">LIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Firewall eSocial</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600">SYNC</span>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Portais do Governo</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-400">POLLING</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-primary shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center justify-center p-0 z-50 ring-4 ring-primary/20"
          >
            <Bot className="size-8 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l-0 bg-slate-50 flex flex-col">
          <SheetHeader className="p-6 bg-primary text-white rounded-bl-3xl">
            <SheetTitle className="text-white font-black uppercase tracking-widest flex items-center gap-2 text-sm">
              <Brain className="size-5" /> 
              Assistente NAI
            </SheetTitle>
            <p className="text-primary-foreground/80 text-xs font-medium">
              Analise prontuários e CIDs em tempo real com apoio clínico.
            </p>
          </SheetHeader>
          <div className="flex-1 p-4 overflow-hidden">
            <MedicalCopilot pacienteId="contexto_geral" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl group hover:ring-2 ring-primary/5 transition-all overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", bg, color)}><Icon className="size-5" /></div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-primary leading-none mb-1">{value}</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase">{sub}</p>
      </CardContent>
    </Card>
  )
}
