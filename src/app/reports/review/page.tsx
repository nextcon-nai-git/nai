
'use client';

import * as React from 'react';
import { BotaoSalvarRelatorio } from '@/components/BotaoSalvarRelatorio';
import relatorioMock from '@/data/relatorio.json';
import { 
  ClipboardCheck, 
  ArrowLeft, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PaginaRelatorio() {
  const data = relatorioMock.relatorio_visita_tecnica;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-primary -ml-2 mb-2 gap-2">
            <Link href="/reports"><ArrowLeft className="size-4" /> Voltar</Link>
          </Button>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">
            Revisão de Auditoria
          </h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
            <ClipboardCheck className="size-3 text-accent" /> Validação de dados antes do protocolo NAI.
          </p>
        </div>
        <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-10 px-4 border border-white/10 shadow-lg">
          ESTÁGIO: PRÉ-PROCESSAMENTO
        </Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-primary uppercase">{data.empresa}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    CNPJ: {data.cnpj} | Unidade: {data.unidade}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-slate-400" />
                    <span className="text-xs font-bold text-primary">{new Date(data.data_visita).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-slate-400" />
                    <span className="text-xs font-bold text-primary">Consultor: {data.consultor}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Itens Inspecionados</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {data.inspecoes.map((inspecao, i) => (
                      <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-primary/10 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              inspecao.status === 'Conforme' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                              {inspecao.status === 'Conforme' ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
                            </div>
                            <span className="text-xs font-black text-primary uppercase">{inspecao.setor}</span>
                          </div>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase border-none px-2 h-5",
                            inspecao.prioridade === 'Alta' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                          )}>
                            Prio: {inspecao.prioridade}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed mb-1">{inspecao.equipamento || inspecao.item}</p>
                        <p className="text-[11px] text-slate-400 italic leading-snug">"{inspecao.descricao}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Zap className="size-32 text-accent" /></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-xl text-primary shadow-lg shadow-accent/20">
                  <Zap className="size-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-accent">Auditoria Inteligente</h3>
              </div>
              
              <p className="text-xs text-white/60 leading-relaxed font-medium italic">
                "Ao clicar abaixo, a NAI analisará as não conformidades identificadas, cruzará com a legislação vigente (NR-12, NR-18, NR-35) e gerará um parecer técnico executivo para o cliente."
              </p>

              <div className="pt-4 border-t border-white/10">
                <BotaoSalvarRelatorio relatorioDados={relatorioMock} />
              </div>
            </div>
          </Card>

          <Card className="card-shadow border-none bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white shadow-sm"><Info className="size-4" /></div>
              <h4 className="text-sm font-black text-primary uppercase">Nota Técnica</h4>
            </div>
            <p className="text-[11px] text-primary/70 leading-relaxed font-medium italic">
              "Este processo de pré-auditoria via Gemini 2.0 Flash garante que nenhum risco crítico seja negligenciado no relatório final, blindando a responsabilidade técnica da Nextcon."
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
