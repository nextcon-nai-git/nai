
'use client';

import * as React from 'react';
import { 
  Zap,
  ChevronRight,
  Calendar,
  AlertTriangle,
  SearchCheck,
  Clock,
  Loader2,
  ClipboardCheck,
  Stethoscope,
  Construction,
  Building2,
  Factory,
  ShieldCheck,
  TrendingUp,
  History
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

  // Queries otimizadas com limites
  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "clients", user.uid, "managedCompanies"), limit(50));
  }, [db, user]);
  const { data: companiesData, isLoading: loadingCompanies } = useCollection(companiesQuery);

  const validCompanies = React.useMemo(() => {
    if (!companiesData) return [];
    return companiesData.filter(c => {
      const name = c.name || "";
      if (!name || name.trim().length < 3) return false;
      if (/^\d+$/.test(name.replace(/[\.\-\/]/g, ''))) return false;
      return true;
    });
  }, [companiesData]);

  const auditsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "clients", user.uid, "auditHistory"), orderBy("createdAt", "desc"), limit(10));
  }, [db, user]);
  const { data: audits, isLoading: loadingAudits } = useCollection(auditsQuery);

  const eventsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "clients", user.uid, "sst_events"), 
      orderBy("date", "asc"), 
      limit(5)
    );
  }, [db, user]);
  const { data: events, isLoading: loadingEvents } = useCollection(eventsQuery);

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
        return {
          title: "Foco NR-18 & NR-35",
          desc: "Gestão de Obras e Trabalho em Altura.",
          icon: Construction,
          color: "text-orange-600",
          bg: "bg-orange-50",
          nrs: ["NR-18 (PCMAT)", "NR-35 (Altura)", "NR-12 (Máquinas)"]
        };
      case 'HOSPITAL':
        return {
          title: "Foco NR-32",
          desc: "Segurança em Serviços de Saúde.",
          icon: Stethoscope,
          color: "text-blue-600",
          bg: "bg-blue-50",
          nrs: ["NR-32 (Saúde)", "NR-07 (PCMSO)", "NR-09 (Riscos)"]
        };
      case 'INDUSTRY':
        return {
          title: "Foco NR-12 & NR-10",
          desc: "Segurança em Máquinas e Elétrica.",
          icon: Factory,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          nrs: ["NR-12 (Equipamentos)", "NR-10 (Elétrica)", "NR-13 (Caldeiras)"]
        };
      default:
        return {
          title: "SST Estratégico",
          desc: "Gestão Geral de Conformidade.",
          icon: ShieldCheck,
          color: "text-primary",
          bg: "bg-muted",
          nrs: ["NR-01 (PGR)", "NR-07 (PCMSO)", "eSocial"]
        };
    }
  }, [segment]);

  const FocusIcon = focus.icon;
  const rawName = profile?.name || user?.email?.split('@')[0] || 'Visitante';
  const nomeExibicao = rawName.toLowerCase() === 'nextcon' ? 'Felipe' : rawName;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="text-3xl font-black text-[#090e24] tracking-tight font-headline">
            {loadingProfile ? <Skeleton className="h-9 w-48" /> : <>{saudacao}, <span className="text-[#f59e0b]">{nomeExibicao}</span></>}
          </div>
          <p className="text-sm text-muted-foreground font-medium">{dataAtual}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#090e24] text-[#f59e0b] font-black uppercase text-[10px] tracking-widest px-3 h-8 flex items-center border border-[#f59e0b]/20">
            {segment === 'CONSTRUCTION' ? 'Engenharia Civil' : segment === 'HOSPITAL' ? 'Saúde & Hospitais' : segment === 'INDUSTRY' ? 'Vertical Industrial' : 'Gestão Padrão'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white group cursor-default overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Clientes Ativos</p>
              <div className="text-2xl font-black text-[#090e24] mt-1">
                {loadingCompanies ? <Skeleton className="h-8 w-12" /> : validCompanies.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
              <Building2 size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white group cursor-default overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pendências IA</p>
              <div className="text-2xl font-black text-[#090e24] mt-1">
                {loadingAudits ? <Skeleton className="h-8 w-12" /> : (audits?.filter(a => a.complianceScore < 100).length || 0)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-50 text-red-600 transition-transform group-hover:scale-110">
              <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn("border-none shadow-md lg:col-span-2 overflow-hidden relative", focus.bg)}>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <FocusIcon size={100} className={focus.color} />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", focus.color)}>{focus.title}</p>
                <h3 className="text-xl font-bold text-[#090e24]">{focus.desc}</h3>
              </div>
              <div className="flex gap-2 mt-4">
                {focus.nrs.map(nr => (
                  <Badge key={nr} variant="outline" className="bg-white/50 border-none text-[9px] font-bold text-[#090e24]">{nr}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-[#090e24] uppercase tracking-tight">Agenda SST Real</CardTitle>
                <CardDescription>Eventos dinâmicos sincronizados em tempo real.</CardDescription>
              </div>
              <Calendar className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {loadingEvents ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                </div>
              ) : events && events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="flex items-center p-4 bg-blue-50/30 rounded-2xl border-l-4 border-primary group hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="w-20 shrink-0">
                      <p className="text-sm font-black text-primary">{event.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#090e24]">{event.type}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                        {event.companyName} • {event.location}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-primary/30 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-2xl opacity-40">
                  <Clock className="size-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-black uppercase tracking-widest">Sem Eventos Próximos</p>
                  <Button asChild variant="outline" size="sm" className="mt-4 border-primary text-primary text-[10px] font-black">
                    <Link href="/data-import">Importar Agenda SST</Link>
                  </Button>
                </div>
              )}
              
              <Button asChild variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary">
                <Link href="/health-control" className="flex items-center justify-center">Ver Agenda Completa <ChevronRight className="size-3 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/esocial-audit", icon: SearchCheck, color: "emerald", label: "Vigilante eSocial", sub: "Auditoria Gemini" },
              { href: "/checklists", icon: ClipboardCheck, color: "blue", label: "Checklists Técnicos", sub: "Inspeções em Campo" },
              { href: "/absenteeism", icon: AlertTriangle, color: "amber", label: "Sentinela NTEP", sub: "Gestão de Nexo" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="border-none shadow-sm hover:ring-2 ring-primary/10 transition-all cursor-pointer bg-white h-full group overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className={cn(
                        "p-3 rounded-xl transition-all group-hover:scale-110",
                        item.color === 'emerald' ? "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white" :
                        item.color === 'blue' ? "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white" :
                        "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
                      )}>
                        <item.icon className="size-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#090e24] text-sm">{item.label}</h4>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-1">{item.sub}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-[#090e24] text-white relative overflow-hidden card-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-24 w-24 text-[#f59e0b]" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-headline uppercase italic">
                <Zap className="h-5 w-5 text-[#f59e0b]" /> Insights NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest mb-2">Monitoramento Ativo</p>
                <div className="text-xs leading-relaxed text-white/80 font-medium">
                  {loadingProfile ? <Skeleton className="h-12 w-full bg-white/10" /> : 
                    segment === 'CONSTRUCTION' 
                    ? "Alerta: Verificamos que 3 colaboradores precisam renovar o treinamento de NR-35 este mês." 
                    : segment === 'HOSPITAL' 
                    ? "Alerta NR-32: Verifique o descarte de resíduos pérfurocortantes na Unidade Central." 
                    : "Dica: Mantenha o Inventário de Riscos atualizado no PGR para evitar multas de eSocial."}
                </div>
              </div>
              <div className="p-4 bg-[#f59e0b] rounded-xl group cursor-pointer hover:bg-[#f59e0b]/90 transition-colors">
                <p className="text-[10px] font-black text-[#090e24] uppercase tracking-widest mb-1">Dica Estratégica</p>
                <p className="text-xs font-bold text-[#090e24]">
                  {segment === 'CONSTRUCTION' ? "O Quiosque de EPI automatiza o registro de CA e validade dos cintos de segurança." : "O Diagrama de Corlett reduz custos com perícias de LER/DORT."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <TrendingUp className="size-3 text-primary" /> Eficiência Global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-black text-[#090e24]">94%</h2>
                <Badge className="bg-emerald-100 text-emerald-700 text-[8px] font-black border-none uppercase">Acima da Média</Badge>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '94%' }} />
              </div>
              <p className="text-[9px] text-muted-foreground mt-3 uppercase font-bold tracking-tighter">
                Sincronização de dados eSocial em tempo real sem erros.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
