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
  const [dataAtual, setDataAtual] = React.useState('');
  
  const [fapValue, setFapValue] = React.useState([1.0]);
  const [payroll, setPayroll] = React.useState(150000);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile, isLoading: loadingProfile } = useDoc(profileRef);

  const isGlobalAdmin = React.useMemo(() => {
    if (loadingProfile || !profile) return false;
    const role = (profile.role || '').toUpperCase();
    const companyId = profile.companyId;
    return ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'ADMIN'].includes(role) && (!companyId || companyId === "");
  }, [profile, loadingProfile]);

  const eventsQuery = useMemoFirebase(() => {
    if (!db || loadingProfile || !profile) return null;
    if (isGlobalAdmin) {
      return query(collectionGroup(db, "sst_events"), orderBy("date", "asc"), limit(5));
    } 
    if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "sst_events"), orderBy("date", "asc"), limit(5));
    }
    return null;
  }, [db, profile, loadingProfile, isGlobalAdmin]);
  
  const { data: events } = useCollection(eventsQuery);

  React.useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');

    const data = new Date();
    const opcoes: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    let dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
    setDataAtual(dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1));
  }, []);

  const potentialSavings = React.useMemo(() => {
    return (payroll * 0.02 * (1 - fapValue[0]) * 12);
  }, [payroll, fapValue]);

  const rawName = profile?.name || user?.email?.split('@')[0] || 'Gestor';
  const nomeExibicao = rawName.toLowerCase() === 'nextcon' ? 'Felipe' : rawName;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={cn("h-8 w-1.5 rounded-full", isGlobalAdmin ? "bg-accent" : "bg-primary")} />
            <h1 className="text-2xl font-black text-primary tracking-tight font-headline uppercase leading-none">
              {loadingProfile ? <Skeleton className="h-10 w-48" /> : <div className="flex items-center gap-3">{saudacao}, <span className={isGlobalAdmin ? "text-accent" : "text-primary"}>{nomeExibicao}</span></div>}
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] ml-4">{dataAtual}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn(
            "text-white font-black uppercase text-[10px] tracking-widest px-5 h-11 border-none shadow-xl shadow-primary/10",
            isGlobalAdmin ? "bg-[#001F3F]" : "bg-primary"
          )}>
            {isGlobalAdmin ? 'NAI • PLATFORM 2026' : 'NAI • CLIENT HUB'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* NAI Strategic Briefing 2026 */}
          <Card className="card-shadow border-none bg-gradient-to-br from-white to-slate-50/50 rounded-[2.5rem] overflow-hidden border border-slate-100">
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
                  <span className="text-xl font-black text-accent">94%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border shadow-sm group hover:ring-2 ring-accent/20 transition-all flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="size-4 text-accent" />
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Saving RAT/FAP Est.</span>
                    </div>
                    <h3 className="text-2xl font-black text-accent">R$ 142.500,00</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Impacto direto no EBITDA.</p>
                  </div>
                  <div className="size-16 rounded-full border-4 border-accent/10 border-t-accent flex items-center justify-center">
                    <span className="text-[10px] font-black">ROI+</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm group hover:ring-2 ring-primary/20 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <Network className="size-4 text-primary" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sincronização NAI API</span>
                  </div>
                  <h3 className="text-2xl font-black text-primary">100% On</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">NAIGED e eSocial integrados.</p>
                </div>
              </div>
              
              {/* Risk Matrix Mini-View */}
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Shield className="size-32 text-accent" /></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Zap className="size-3 fill-current" /> Insight Preditivo NAI
                    </p>
                    <p className="text-sm italic font-medium leading-relaxed text-white/80">
                      "A análise de GHE detectou tendência de aumento em absenteísmo osteomuscular. Recomendamos auditoria na NR-17 Setor Operacional."
                    </p>
                  </div>
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 size-24 mx-auto">
                    <div className="risk-matrix-cell bg-emerald-500/20" />
                    <div className="risk-matrix-cell bg-amber-500/40" />
                    <div className="risk-matrix-cell bg-emerald-500/40" />
                    <div className="risk-matrix-cell bg-red-500 animate-pulse border-2 border-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Vidas Ativas" value="1.402" sub="Vigilância NAI" icon={UsersIcon} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="ASOs Pendentes" value="12" sub="Vencimento 30 dias" icon={HeartPulse} color="text-red-600" bg="bg-red-50" />
            <StatCard label="Eficiência API" value="99.8%" sub="Uptime Sistema" icon={Network} color="text-accent" bg="bg-accent/5" />
          </div>
        </div>

        <div className="space-y-8">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="bg-primary/5 pb-6 p-8 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-xl shadow-lg">
                  <Calculator className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black text-primary uppercase tracking-tight">Simulador ROI NAI</CardTitle>
                </div>
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
                  <h3 className={cn("text-2xl font-black font-headline tracking-tighter", potentialSavings >= 0 ? "text-accent" : "text-red-600")}>
                    {Math.abs(potentialSavings).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </h3>
                  {potentialSavings > 0 && <ArrowUpRight className="size-5 text-accent" />}
                </div>
              </div>
              <Button asChild variant="outline" className="w-full h-12 border-primary/10 text-primary font-black uppercase text-[9px] tracking-widest rounded-xl">
                <Link href="/financial">Explorar NAI Financeiro</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Próximos Vencimentos</CardTitle>
                <Activity className="size-3 text-red-500 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {events && events.length > 0 ? (
                <div className="divide-y">
                  {events.map((event) => (
                    <div key={event.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="text-center w-10">
                          <p className="text-sm font-black text-primary group-hover:text-accent transition-colors">{new Date(event.date).getDate()}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{new Date(event.date).toLocaleDateString('pt-BR', {month: 'short'})}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase leading-tight">{event.description}</p>
                          <Badge variant="outline" className="text-[7px] font-bold mt-1 uppercase border-primary/10 text-primary/40">{event.type}</Badge>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-slate-200 group-hover:text-accent transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center opacity-20">
                  <Clock size={40} className="mx-auto text-primary mb-2" />
                  <p className="text-[9px] font-black text-primary uppercase">Sem alertas críticos</p>
                </div>
              )}
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