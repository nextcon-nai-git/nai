
'use client';

import * as React from 'react';
import { 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Scale,
  TrendingUp,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

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
    // 1. Lógica da Saudação (Dia/Tarde/Noite)
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      setSaudacao('Bom dia');
    } else if (hora >= 12 && hora < 18) {
      setSaudacao('Boa tarde');
    } else {
      setSaudacao('Boa noite');
    }

    // 2. Lógica da Data (Ex: quarta-feira, 4 de fevereiro)
    const data = new Date();
    const opcoes: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    
    let dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
    dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    
    setDataAtual(dataFormatada);
  }, []);

  const metrics = [
    { label: "ROI PREVENÇÃO", value: "R$ 452.800", icon: DollarSign, color: "text-blue-600" },
    { label: "FATOR FAP", value: "0,74", icon: TrendingDown, color: "text-emerald-600" },
    { label: "PASSIVO NAI", value: "R$ 1.2M", icon: Scale, color: "text-amber-600" },
    { label: "COMPLIANCE", value: "98.5%", icon: ShieldCheck, color: "text-indigo-600" },
  ];

  const nomeExibicao = profile?.name || user?.email?.split('@')[0] || 'Visitante';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-[#090e24] tracking-tight font-headline">
            {saudacao}, <span className="text-[#f59e0b]">{nomeExibicao}</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium mb-4">
            {dataAtual}
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#f59e0b] text-[#090e24] font-black uppercase text-[10px] tracking-widest px-3">Estratégico 2026</Badge>
            <Badge variant="outline" className="border-primary/20 text-primary text-[10px] uppercase font-bold">Unidade Curitiba</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <Card key={m.label} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{m.label}</p>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <h3 className="text-3xl font-black text-[#090e24] tracking-tighter">{m.value}</h3>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Aumento de eficiência</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-[#090e24] text-white">
            <CardTitle className="text-xl font-bold font-headline uppercase tracking-tight">Análise de ROI e Economia RAT/FAP</CardTitle>
            <CardDescription className="text-white/60">Monitoramento de impactos financeiros diretos na folha.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed flex items-center justify-center text-muted-foreground text-xs uppercase font-bold tracking-widest">
              [ Gráfico de Tendência 2026 ]
            </div>
            <div className="mt-8 p-6 bg-[#090e24] rounded-2xl flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <ArrowUpRight className="h-6 w-6 text-[#f59e0b]" />
                </div>
                <div>
                  <p className="text-sm font-bold">Salvaguarda Administrativa</p>
                  <p className="text-[10px] text-white/50 uppercase font-black">Projeção NAI</p>
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
                <Zap className="h-5 w-5 text-[#f59e0b]" /> Insights NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest mb-2">Alerta eSocial</p>
                <p className="text-xs leading-relaxed text-white/80 font-medium">Cruzamento de dados entre PGR e PCMSO indica conformidade de 98% para o evento S-2240.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Custo de Acidentalidade</p>
                <p className="text-xs leading-relaxed text-white/80 font-medium">A redução do NTEP pela contestação ativa NAI evitou R$ 120k em encargos este mês.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
