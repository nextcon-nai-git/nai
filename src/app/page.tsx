
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
  Brain,
  ArrowUpRight,
  Users as UsersIcon,
  Network,
  Activity,
  BarChart3,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [saudacao, setSaudacao] = React.useState('');
  
  const [fapValue, setFapValue] = React.useState([0.74]);
  const [payroll, setPayroll] = React.useState(150000);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile, isLoading: loadingProfile } = useDoc(profileRef);

  const isGlobalAdmin = React.useMemo(() => {
    if (loadingProfile || !profile) return false;
    const role = (profile.role || '').toUpperCase();
    return ['SUPER_ADMIN', 'ADMIN'].includes(role);
  }, [profile, loadingProfile]);

  React.useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');
  }, []);

  const potentialSavings = React.useMemo(() => {
    return (payroll * 0.02 * (1 - fapValue[0]) * 12);
  }, [payroll, fapValue]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-primary" />
            <h1 className="text-2xl font-black text-primary tracking-tight font-headline uppercase leading-none">
              {loadingProfile ? <Skeleton className="h-10 w-48" /> : <div>{saudacao}, <span className="text-slate-500">{profile?.name || 'Gestor'}</span></div>}
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] ml-4">Monitoramento Estratégico NAI</p>
        </div>
        <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-5 h-11 border-none shadow-xl">
          {isGlobalAdmin ? 'NAI • BACKOFFICE 2026' : 'NAI • CLIENT HUB'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* NAI Strategic Briefing 2026 */}
          <Card className="card-shadow border-none bg-gradient-to-br from-white to-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100">
            <CardHeader className="pb-4 px-8 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary text-white rounded-xl shadow-inner">
                    <Brain className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-primary uppercase">NAI Strategic Briefing</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Status de Blindagem Técnica e Tributária.</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Compliance Score</span>
                  <span className="text-xl font-black text-primary">94%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border shadow-sm group hover:ring-2 ring-primary/10 transition-all flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="size-4 text-primary" />
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Saving RAT/FAP Est.</span>
                    </div>
                    <h3 className="text-2xl font-black text-primary">R$ 142.500,00</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Impacto direto no EBITDA.</p>
                  </div>
                  <div className="size-16 rounded-full border-4 border-slate-100 border-t-primary flex items-center justify-center">
                    <span className="text-[10px] font-black text-primary">ROI+</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm group hover:ring-2 ring-primary/10 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <Network className="size-4 text-primary" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sincronização NAI API</span>
                  </div>
                  <h3 className="text-2xl font-black text-primary">100% On</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">NAIGED e eSocial integrados.</p>
                </div>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Shield className="size-32 text-white" /></div>
                <div className="relative z-10 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Zap className="size-3 fill-current text-primary" /> Insight Preditivo NAI
                  </p>
                  <p className="text-sm italic font-medium leading-relaxed text-slate-300">
                    "A análise de GHE detectou tendência de aumento em absenteísmo osteomuscular. Recomendamos auditoria na NR-17 Setor Operacional para evitar multas de até R$ 44k."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Vidas Ativas" value="806" sub="Vigilância NAI" icon={UsersIcon} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="ASOs Pendentes" value="12" sub="Vencimento 30 dias" icon={HeartPulse} color="text-red-600" bg="bg-red-50" />
            <StatCard label="Eficiência API" value="99.8%" sub="Uptime Sistema" icon={Network} color="text-primary" bg="bg-primary/5" />
          </div>
        </div>

        <div className="space-y-8">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden group">
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
              <Button asChild variant="outline" className="w-full h-12 border-primary/10 text-primary font-black uppercase text-[9px] tracking-widest rounded-xl">
                <Link href="/financial">Explorar NAI Financeiro</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Próximos Alertas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-10 text-center opacity-20">
                <Clock size={40} className="mx-auto text-primary mb-2" />
                <p className="text-[9px] font-black text-primary uppercase">Sincronizando Fila eSocial...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl group hover:ring-2 ring-primary/5 transition-all overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", bg, color)}><Icon className="size-5" /></div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-primary leading-none mb-1">{value}</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase">{sub}</p>
      </CardContent>
    </Card>
  )
}
