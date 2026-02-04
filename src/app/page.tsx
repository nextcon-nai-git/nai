
'use client';

import * as React from 'react';
import { 
  Zap,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
  AlertTriangle,
  SearchCheck,
  Sparkles,
  Clock,
  Loader2,
  ClipboardCheck,
  Stethoscope,
  Construction,
  Building2,
  Factory,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [saudacao, setSaudacao] = React.useState('');
  const [dataAtual, setDataAtual] = React.useState('');

  // Perfil do Usuário
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);

  // Busca dados da Empresa para o Segmento
  const companyRef = useMemoFirebase(() => {
    if (!db || !user || !profile?.companyId) return null;
    return doc(db, "clients", user.uid, "managedCompanies", profile.companyId);
  }, [db, user, profile?.companyId]);
  const { data: company } = useDoc(companyRef);

  const segment = company?.segment || "GENERAL";

  // Contadores Reais
  const employeesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "clients", user.uid, "employees"));
  }, [db, user]);
  const { data: employees } = useCollection(employeesQuery);

  const auditsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "clients", user.uid, "auditHistory"));
  }, [db, user]);
  const { data: audits } = useCollection(auditsQuery);

  // Agenda Real
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

  const getSegmentFocus = () => {
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
  };

  const focus = getSegmentFocus();
  const rawName = profile?.name || user?.email?.split('@')[0] || 'Visitante';
  const nomeExibicao = rawName.toLowerCase() === 'nextcon' ? 'Felipe' : rawName;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-[#090e24] tracking-tight font-headline">
            {saudacao}, <span className="text-[#f59e0b]">{nomeExibicao}</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">{dataAtual}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#090e24] text-[#f59e0b] font-black uppercase text-[10px] tracking-widest px-3 h-8 flex items-center border border-[#f59e0b]/20">
            {segment === 'CONSTRUCTION' ? 'Engenharia Civil' : segment === 'HOSPITAL' ? 'Saúde & Hospitais' : segment === 'INDUSTRY' ? 'Vertical Industrial' : 'Gestão Padrão'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white group cursor-default">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Vidas Ativas</p>
              <h3 className="text-2xl font-black text-[#090e24] mt-1">{employees?.length || 0}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <User size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white group cursor-default">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pendências IA</p>
              <h3 className="text-2xl font-black text-[#090e24] mt-1">{audits?.filter(a => a.complianceScore < 100).length || 0}</h3>
            </div>
            <div className="p-3 rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>
        
        {/* Card Adaptativo por Segmento */}
        <Card className={cn("border-none shadow-md lg:col-span-2 overflow-hidden relative", focus.bg)}>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <focus.icon size={100} className={focus.color} />
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
                <CardDescription>Eventos dinâmicos sincronizados com seus clientes.</CardDescription>
              </div>
              <Calendar className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {loadingEvents ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <Loader2 className="size-8 animate-spin text-primary opacity-20" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">NAI Sincronizando...</p>
                </div>
              ) : events && events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="flex items-center p-4 bg-blue-50/30 rounded-2xl border-l-4 border-primary group hover:bg-blue-50 transition-colors">
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
                  <p className="text-sm font-black uppercase tracking-widest">Sem Eventos</p>
                  <Button asChild variant="outline" size="sm" className="mt-4 border-primary text-primary text-[10px] font-black">
                    <Link href="/data-import">Importar Agenda SST</Link>
                  </Button>
                </div>
              )}
              
              <Button asChild variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary">
                <Link href="/health-control">Ver Agenda Completa <ChevronRight className="size-3 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/esocial-audit">
              <Card className="border-none shadow-sm hover:ring-2 ring-emerald-500/20 transition-all cursor-pointer bg-white h-full group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <SearchCheck className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#090e24] text-sm">Vigilante eSocial</h4>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-1">Auditoria via Gemini.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/checklists">
              <Card className="border-none shadow-sm hover:ring-2 ring-blue-500/20 transition-all cursor-pointer bg-white h-full group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <ClipboardCheck className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#090e24] text-sm">Checklists {segment === 'CONSTRUCTION' ? 'Obras' : ''}</h4>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-1">Inspeções Técnicas.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/absenteeism">
              <Card className="border-none shadow-sm hover:ring-2 ring-amber-500/20 transition-all cursor-pointer bg-white h-full group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <AlertTriangle className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#090e24] text-sm">Sentinela NTEP</h4>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-1">Gestão de Afastamentos.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-[#090e24] text-white relative overflow-hidden">
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
                <p className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest mb-2">Foco Normativo</p>
                <p className="text-xs leading-relaxed text-white/80 font-medium">
                  {segment === 'CONSTRUCTION' 
                    ? "Alerta: Verificamos que 3 colaboradores precisam renovar o treinamento de NR-35 este mês." 
                    : segment === 'HOSPITAL' 
                    ? "Alerta NR-32: Verifique o descarte de resíduos pérfurocortantes na Unidade Central." 
                    : "Dica: Mantenha o Inventário de Riscos atualizado no PGR para evitar multas de eSocial."}
                </p>
              </div>
              <div className="p-4 bg-[#f59e0b] rounded-xl">
                <p className="text-[10px] font-black text-[#090e24] uppercase tracking-widest mb-1">Dica Estratégica</p>
                <p className="text-xs font-bold text-[#090e24]">
                  {segment === 'CONSTRUCTION' ? "Use o Quiosque de EPI para registrar a entrega de cintos de segurança com foto." : "O Diagrama de Corlett ajuda a prevenir afastamentos por LER/DORT."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
