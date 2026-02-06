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
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
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

  const companyRef = useMemoFirebase(() => {
    if (!db || !user || !profile?.companyId) return null;
    return doc(db, "clients", user.uid, "managedCompanies", profile.companyId);
  }, [db, user, profile?.companyId]);
  const { data: company } = useDoc(companyRef);

  const segment = company?.segment || "GENERAL";

  const auditsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "clients", user.uid, "auditHistory"), orderBy("createdAt", "desc"), limit(5));
  }, [db, user]);
  const { data: audits } = useCollection(auditsQuery);

  const eventsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "clients", user.uid, "sst_events"), orderBy("date", "asc"), limit(3));
  }, [db, user]);
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

  const focus = React.useMemo(() => {
    switch (segment) {
      case 'CONSTRUCTION':
        return { title: "Foco NR-18 & NR-35", icon: Construction, color: "text-blue-600", bg: "bg-blue-50" };
      case 'INDUSTRY':
        return { title: "Foco NR-12 & NR-10", icon: Factory, color: "text-primary", bg: "bg-primary/5" };
      default:
        return { title: "Gestão SST 360°", icon: ShieldCheck, color: "text-primary", bg: "bg-gray-50" };
    }
  }, [segment]);

  const FocusIcon = focus.icon;
  const rawName = profile?.name || user?.email?.split('@')[0] || 'Visitante';
  const nomeExibicao = rawName.toLowerCase() === 'nextcon' ? 'Felipe' : rawName;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-3xl font-black text-primary tracking-tight font-headline">
            {loadingProfile ? <Skeleton className="h-10 w-48" /> : <div className="flex items-center gap-2">{saudacao}, <span className="text-accent">{nomeExibicao}</span></div>}
          </div>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">{dataAtual}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary text-white font-bold uppercase text-[10px] tracking-widest px-4 h-10 border-none shadow-lg">
            Sistema NAI v2.6 Online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Building2 size={80} className="text-primary" />
          </div>
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">Unidade Principal</p>
            <h3 className="text-xl font-bold text-primary truncate">{company?.name || "NextCon Gestão"}</h3>
            <div className="mt-6 flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-black text-[9px] uppercase">{segment}</Badge>
              <Badge variant="outline" className="bg-accent/10 text-primary border-accent/20 font-black text-[9px] uppercase">Vigente</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-primary text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-accent/10 opacity-20 pointer-events-none" />
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-2">Conformidade eSocial</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-accent">98%</h3>
              <TrendingUp className="size-4 text-accent" />
            </div>
            <p className="text-xs font-bold text-white/70 mt-4 uppercase tracking-tighter">Eventos S-2220 / S-2240 Sincronizados</p>
          </CardContent>
        </Card>

        <Card className={cn("card-shadow border-none overflow-hidden", focus.bg)}>
          <CardContent className="p-8 flex items-center gap-6">
            <div className={cn("p-4 rounded-3xl bg-white shadow-sm", focus.color)}>
              <FocusIcon size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Estratégia</p>
              <h3 className="text-lg font-bold text-primary">{focus.title}</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Vigilância Ativa NAI</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="border-b border-gray-50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-primary uppercase tracking-tight">Próximos Passos SST</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest text-gray-400">Agenda técnica e renovações</CardDescription>
                </div>
                <div className="p-2 bg-primary/5 rounded-xl text-primary"><Calendar className="size-5" /></div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {events && events.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center p-6 hover:bg-gray-50 transition-all cursor-pointer group">
                      <div className="w-20 shrink-0">
                        <p className="text-xs font-black text-primary group-hover:text-accent transition-colors">{event.time}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(event.date).toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})}</p>
                      </div>
                      <div className="flex-1 px-4">
                        <p className="text-sm font-bold text-primary">{event.type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{event.companyName}</p>
                      </div>
                      <ChevronRight className="size-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto"><Clock className="text-gray-200" /></div>
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Sem eventos na agenda</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/esocial-audit", icon: SearchCheck, label: "Auditoria eSocial", desc: "IA Gemini ativa" },
              { href: "/checklists", icon: ClipboardCheck, label: "Hub Técnico", desc: "Laudos e Scanner" },
              { href: "/absenteeism", icon: AlertTriangle, label: "Sentinela NTEP", desc: "Gestão de Nexo" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="card-shadow border-none bg-white h-full hover:bg-primary transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-white transition-all">
                      <item.icon className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary group-hover:text-white text-sm">{item.label}</h4>
                      <p className="text-[9px] text-gray-400 group-hover:text-white/60 font-bold uppercase mt-1">{item.desc}</p>
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
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 font-headline uppercase italic">
                <Zap className="h-5 w-5 text-accent" /> Insights NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">Inteligência Operacional</p>
                <p className="text-xs leading-relaxed text-white/80 font-medium">
                  {segment === 'CONSTRUCTION' 
                    ? "Identificamos que 12% dos colaboradores de campo precisam atualizar o treinamento de NR-18." 
                    : "Dica: A atualização do S-2240 deve ocorrer até o dia 15 do mês subsequente à alteração."}
                </p>
              </div>
              <Button asChild variant="outline" className="w-full h-12 bg-transparent border-white/20 text-white hover:bg-white hover:text-primary transition-all font-bold uppercase text-[10px] tracking-widest">
                <Link href="/knowledge-base">Falar com Assistente IA</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="size-3 text-accent" /> Performance Global
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-3xl font-black text-primary">94.8%</h2>
                <Badge className="bg-accent/10 text-primary text-[8px] font-black border-none uppercase">Acima da Média</Badge>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '94.8%' }} />
              </div>
              <p className="text-[9px] text-gray-400 mt-4 uppercase font-bold tracking-tighter">
                Índice de conformidade técnica e documental da agência.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
