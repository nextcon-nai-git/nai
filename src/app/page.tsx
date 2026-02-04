
'use client';

import * as React from 'react';
import { 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Scale,
  TrendingUp,
  Zap,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Construction,
  FileText,
  AlertTriangle,
  Activity,
  UserMinus,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [saudacao, setSaudacao] = React.useState('');
  const [dataAtual, setDataAtual] = React.useState('');

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);

  React.useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      setSaudacao('Bom dia');
    } else if (hora >= 12 && hora < 18) {
      setSaudacao('Boa tarde');
    } else {
      setSaudacao('Boa noite');
    }

    const data = new Date();
    const opcoes: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    let dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
    dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    setDataAtual(dataFormatada);
  }, []);

  const naiIndicators = [
    { title: "Convocação de Exames", category: "Saúde", icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Exames Realizados", category: "Saúde", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Entrega de EPI", category: "Segurança", icon: Construction, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "ASOs Emitidos", category: "Saúde", icon: FileText, color: "text-teal-600", bg: "bg-teal-50" },
    { title: "Acidentes", category: "Segurança", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { title: "Atestados de Saúde", category: "Saúde", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Afastamento INSS", category: "Gestão", icon: UserMinus, color: "text-gray-600", bg: "bg-gray-50" },
    { title: "Status do PGR", category: "Segurança", icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50" }
  ];

  const nomeExibicao = profile?.name || user?.email?.split('@')[0] || 'Visitante';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-[#090e24] tracking-tight font-headline">
            {saudacao}, <span className="text-[#f59e0b]">{nomeExibicao}</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {dataAtual}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge className="bg-[#f59e0b] text-[#090e24] font-black uppercase text-[10px] tracking-widest px-3">Estratégico 2026</Badge>
            <Badge variant="outline" className="border-primary/20 text-primary text-[10px] uppercase font-bold">Unidade Curitiba</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {naiIndicators.map((indicator) => (
          <Card key={indicator.title} className="border-none shadow-sm hover:shadow-md transition-all bg-white group cursor-default">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg transition-colors", indicator.bg)}>
                  <indicator.icon className={cn("h-5 w-5", indicator.color)} />
                </div>
                <Badge variant="outline" className="text-[8px] uppercase font-black tracking-tighter opacity-50">
                  {indicator.category}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-[#090e24] leading-tight mb-1">{indicator.title}</h3>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-black text-[#090e24]">0</p>
                <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  Estável
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-[#090e24] text-white">
            <CardTitle className="text-xl font-bold font-headline uppercase tracking-tight">Impacto Financeiro & ROI SST</CardTitle>
            <CardDescription className="text-white/60">Economia projetada com base na redução de acidentes e contestações.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed flex items-center justify-center text-muted-foreground text-xs uppercase font-bold tracking-widest">
              [ Gráfico de Tendência Operacional 2026 ]
            </div>
            <div className="mt-8 p-6 bg-[#090e24] rounded-2xl flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <ArrowUpRight className="h-6 w-6 text-[#f59e0b]" />
                </div>
                <div>
                  <p className="text-sm font-bold">Salvaguarda Administrativa</p>
                  <p className="text-[10px] text-white/50 uppercase font-black">Projeção NEXTCON</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">R$ 452.800,00</p>
                <p className="text-[10px] font-black text-[#f59e0b] uppercase">Economia Direta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-[#090e24] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-24 w-24 text-[#f59e0b]" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-headline uppercase italic">
                <Zap className="h-5 w-5 text-[#f59e0b]" /> Insights de Gestão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest mb-2">Alerta eSocial</p>
                <p className="text-xs leading-relaxed text-white/80 font-medium">Cruzamento de dados entre PGR e PCMSO indica conformidade de 98% para o evento S-2240.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Custo de Acidentalidade</p>
                <p className="text-xs leading-relaxed text-white/80 font-medium">A redução do NTEP pela contestação ativa evitou R$ 120k em encargos este mês.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
