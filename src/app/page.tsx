
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
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile, isLoading: loadingProfile } = useDoc(profileRef);

  const isPrivileged = React.useMemo(() => {
    return profile && ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role);
  }, [profile]);

  // Dashboards administrativos buscam em todas as empresas via collectionGroup
  // Dashboards de cliente buscam apenas na sua sub-coleção
  const auditsQuery = useMemoFirebase(() => {
    if (!db || !profile) return null;
    
    if (isPrivileged) {
      return query(collectionGroup(db, "auditHistory"), orderBy("createdAt", "desc"), limit(5));
    } else if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "auditHistory"), orderBy("createdAt", "desc"), limit(5));
    }
    return null;
  }, [db, profile, isPrivileged]);
  const { data: audits } = useCollection(auditsQuery);

  const eventsQuery = useMemoFirebase(() => {
    if (!db || !profile) return null;
    
    if (isPrivileged) {
      return query(collectionGroup(db, "sst_events"), orderBy("date", "asc"), limit(3));
    } else if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "sst_events"), orderBy("date", "asc"), limit(3));
    }
    return null;
  }, [db, profile, isPrivileged]);
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
            <div className="h-8 w-1.5 bg-accent rounded-full" />
            <h1 className="text-4xl font-black text-primary tracking-tight font-headline uppercase leading-none">
              {loadingProfile ? <Skeleton className="h-10 w-48" /> : <div className="flex items-center gap-3">{saudacao}, <span className="text-accent">{nomeExibicao}</span></div>}
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] ml-4">{dataAtual}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-5 h-11 border-none shadow-xl shadow-primary/10">
            NextCon SST Intelligence v2.6
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-shadow border-none bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 scale-150 group-hover:rotate-12">
            <Layers size={80} className="text-primary" />
          </div>
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">Unidades Ativas</p>
            <h3 className="text-2xl font-black text-primary">25 <span className="text-xs text-gray-300 font-medium">Plantas</span></h3>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-black text-[8px] uppercase tracking-tighter">Time Now Master</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none gradient-nextcon text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" />
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-2">Compliance eSocial</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-white">98%</h3>
              <TrendingUp className="size-4 text-accent" />
            </div>
            <p className="text-[9px] font-bold text-white/70 mt-4 uppercase tracking-widest">S-2220 & S-2240 Atualizados</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-white relative overflow-hidden group">
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">Vidas Gerenciadas</p>
            <h3 className="text-2xl font-black text-primary">1.402 <span className="text-xs text-gray-300 font-medium">Colaboradores</span></h3>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full w-[85%]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-[#090e24] text-white group cursor-pointer hover:bg-[#002d9c] transition-all">
          <CardContent className="p-8 flex flex-col justify-center items-center text-center gap-2">
            <div className="p-3 rounded-2xl bg-white/5 text-accent mb-2">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest">Assistente NAI</h3>
            <p className="text-[9px] text-white/40 font-bold uppercase">Base Legal 2026 Ativa</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-shadow border-none bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 pb-6 bg-gray-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-xl text-primary"><Calendar className="size-5" /></div>
                  <div>
                    <CardTitle className="text-lg font-black text-primary uppercase tracking-tight font-headline">Agenda Estratégica SST</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Renovações e Visitas Técnicas</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-primary hover:bg-primary/5">Ver Completa</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {events && events.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center p-6 hover:bg-gray-50/80 transition-all cursor-pointer group">
                      <div className="w-20 shrink-0 text-center border-r pr-4">
                        <p className="text-sm font-black text-primary group-hover:text-accent transition-colors">{event.time}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(event.date).toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})}</p>
                      </div>
                      <div className="flex-1 px-6">
                        <p className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">{event.type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate tracking-tighter">{event.companyName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black uppercase">Confirmado</Badge>
                        <ChevronRight className="size-4 text-gray-200 group-hover:text-primary transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center space-y-4 opacity-30">
                  <Clock className="size-12 mx-auto text-gray-200" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Nenhuma atividade agendada</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/esocial-audit", icon: SearchCheck, label: "Auditoria eSocial", desc: "IA Gemini 2.0" },
              { href: "/checklists", icon: ClipboardCheck, label: "Hub de Laudos", desc: "Scanner Digital" },
              { href: "/absenteeism", icon: AlertTriangle, label: "Gestão NTEP", desc: "Sentinela NAI" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="card-shadow border-none bg-white h-full transition-all group-hover:ring-2 ring-accent/20">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-[1.5rem] bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110">
                      <item.icon className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-primary text-xs uppercase tracking-tight">{item.label}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1.5 tracking-widest">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none gradient-nextcon text-white card-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Sparkles className="size-32 text-accent" /></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-sm flex items-center gap-2 font-black uppercase italic tracking-[0.2em] text-accent">
                <Zap className="h-4 w-4" /> Insight NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Inteligência Operacional</p>
                <p className="text-xs leading-relaxed text-white/90 font-medium italic">
                  "Identificamos que 85% dos seus eventos S-2240 estão sendo transmitidos em menos de 24h após a emissão do laudo. Performance acima do mercado."
                </p>
              </div>
              <Button asChild variant="outline" className="w-full h-14 bg-white/5 border-white/10 text-white hover:bg-white hover:text-primary transition-all font-black uppercase text-[10px] tracking-widest rounded-2xl">
                <Link href="/knowledge-base">Consultar Base Normativa</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white relative overflow-hidden group">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] flex items-center gap-2">
                <TrendingUp className="size-3 text-accent" /> ROI em Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-4xl font-black text-primary tracking-tighter">94.8%</h2>
                <Badge className="bg-accent/10 text-primary text-[9px] font-black border-none uppercase px-3">Alta Performance</Badge>
              </div>
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden mb-4 shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000" style={{ width: '94.8%' }} />
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-relaxed">
                Índice consolidado de conformidade técnica, jurídica e operacional de todas as suas unidades gerenciadas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
