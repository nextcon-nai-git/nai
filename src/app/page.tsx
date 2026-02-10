
'use client';

import * as React from 'react';
import { 
  Zap,
  ChevronRight,
  Calendar,
  AlertTriangle,
  SearchCheck,
  Clock,
  ClipboardCheck,
  Stethoscope,
  Construction,
  Building2,
  Factory,
  ShieldCheck,
  TrendingUp,
  History,
  Sparkles,
  Layers,
  Activity,
  BarChart3,
  Users,
  CheckCircle2,
  HeartPulse,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview Dashboard Principal (Agenda SESMT)
 * Visão centralizada de tudo que o gestor deve se preocupar hoje.
 */

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [saudacao, setSaudacao] = React.useState('');
  const [dataAtual, setDataAtual] = React.useState('');

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile, isLoading: loadingProfile } = useDoc(profileRef);

  const role = (profile?.role || 'CLIENT_ADMIN').toUpperCase();
  const isAdmin = ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(role);

  const eventsQuery = useMemoFirebase(() => {
    if (!db || !profile) return null;
    if (isAdmin) {
      return query(collectionGroup(db, "sst_events"), orderBy("date", "asc"), limit(4));
    } else if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "sst_events"), orderBy("date", "asc"), limit(4));
    }
    return null;
  }, [db, profile, isAdmin]);
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

  const rawName = profile?.name || user?.email?.split('@')[0] || 'Gestor';
  const nomeExibicao = rawName.toLowerCase() === 'nextcon' ? 'Felipe' : rawName;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={cn("h-8 w-1.5 rounded-full", isAdmin ? "bg-accent" : "bg-primary")} />
            <h1 className="text-4xl font-black text-primary tracking-tight font-headline uppercase leading-none">
              {loadingProfile ? <Skeleton className="h-10 w-48" /> : <div className="flex items-center gap-3">{saudacao}, <span className={isAdmin ? "text-accent" : "text-primary"}>{nomeExibicao}</span></div>}
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] ml-4">{dataAtual}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn(
            "text-white font-black uppercase text-[10px] tracking-widest px-5 h-11 border-none shadow-xl shadow-primary/10",
            isAdmin ? "bg-[#001F3F]" : "bg-primary"
          )}>
            {isAdmin ? 'SESMT Global Control v2.6' : 'SESMT Portal do Cliente'}
          </Badge>
        </div>
      </div>

      {/* Agenda SESMT Centralizada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b pb-8 px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                    <Calendar className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline font-black text-primary uppercase">Agenda SESMT (O que cuidar hoje?)</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vencimentos de Exames, Laudos e Treinamentos.</CardDescription>
                  </div>
                </div>
                <Button variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest rounded-xl">Expandir Calendário</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {events && events.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="w-24 shrink-0 text-center border-r border-dashed pr-6">
                        <p className="text-lg font-black text-primary group-hover:text-accent transition-colors">{event.time}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(event.date).toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})}</p>
                      </div>
                      <div className="flex-1 px-8">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[8px] font-black uppercase text-primary/40 border-primary/10">{event.type}</Badge>
                          {event.priority === 'high' && <Badge className="bg-red-50 text-red-600 text-[8px] font-black uppercase border-none px-2">Urgente</Badge>}
                        </div>
                        <p className="text-sm font-black text-primary group-hover:translate-x-1 transition-transform uppercase tracking-tight">{event.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate mt-1">{event.companyName}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                          <p className="text-[10px] font-black text-emerald-600 uppercase">Confirmado</p>
                        </div>
                        <ChevronRight className="size-5 text-slate-200 group-hover:text-primary transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-32 text-center space-y-6 opacity-20">
                  <Clock size={64} className="mx-auto text-primary" />
                  <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">Nenhuma atividade crítica para hoje</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="ASOs Pendentes" value="12" sub="Vencimento 30 dias" icon={HeartPulse} color="text-red-600" bg="bg-red-50" />
            <StatCard label="Treinamentos" value="04" sub="Turmas ativas" icon={GraduationCap} color="text-orange-600" bg="bg-orange-50" />
            <StatCard label="Eventos eSocial" value="128" sub="Transmitidos hoje" icon={Zap} color="text-purple-600" bg="bg-purple-50" />
          </div>
        </div>

        <div className="space-y-8">
          <Card className={cn(
            "border-none text-white card-shadow relative overflow-hidden rounded-[2.5rem]",
            isAdmin ? "bg-[#001F3F]" : "gradient-nextcon"
          )}>
            <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="size-40 text-accent" /></div>
            <CardHeader className="pb-6 relative z-10 p-8">
              <CardTitle className="text-xs flex items-center gap-3 font-black uppercase italic tracking-[0.2em] text-accent">
                <Zap className="size-5 fill-current" /> Insight NAI SESMT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10 p-8 pt-0">
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Análise de Risco 24h</p>
                <p className="text-sm leading-relaxed text-white/90 font-medium italic">
                  {isAdmin 
                    ? '"Detectamos aumento de 15% em afastamentos por CID M54 na rede de construção civil. Recomenda-se auditoria ergonômica preventiva."'
                    : '"Sua unidade atingiu 100% de conformidade S-2240. O próximo PGR vence em 45 dias. Agendamento liberado."'
                  }
                </p>
              </div>
              <Button asChild variant="outline" className="w-full h-16 bg-white/5 border-white/10 text-white hover:bg-white hover:text-primary transition-all font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl">
                <Link href="/knowledge-base">Consultar Cérebro NAI</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="pb-2 p-8">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <TrendingUp className="size-3 text-accent" /> Score de Conformidade Global
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-5xl font-black text-primary tracking-tighter">94.8%</h2>
                <Badge className="bg-accent text-primary text-[9px] font-black border-none uppercase px-4 h-6">Excelência</Badge>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000" style={{ width: '94.8%' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Técnica</p>
                  <p className="text-xs font-bold text-primary">98%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Jurídica</p>
                  <p className="text-xs font-bold text-primary">91%</p>
                </div>
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
          <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", bg, color)}>
            <Icon className="size-5" />
          </div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-primary leading-none mb-1">{value}</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase">{sub}</p>
      </CardContent>
    </Card>
  )
}
