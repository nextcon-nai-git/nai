
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
  Zap,
  Target,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PaginaRelatorio() {
  const data = relatorioMock.relatorio_visita_tecnica;
  const header = data.cabecalho;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-primary -ml-2 mb-2 gap-2">
            <Link href="/reports"><ArrowLeft className="size-4" /> Voltar</Link>
          </Button>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">
            Revisão de Auditoria Técnica
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
        <div className="lg:col-span-2 space-y-8">
          {/* Cabeçalho da Empresa */}
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-primary uppercase">{header.empresa_atendida}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    CNPJ: {header.cnpj} | Tipo: {header.tipo_visita}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-primary uppercase">Visita: {new Date(header.datas_visita[0]).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-primary uppercase">Consultor: {header.consultor_responsavel}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Unidades Inspecionadas</h3>
                {header.enderecos.map((end: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <ChevronRight className="size-3 text-accent" /> {end}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objetivos */}
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
              <Target className="size-3 text-primary" /> Objetivos da Visita
            </h3>
            <div className="space-y-3">
              {data.objetivos_visita.map((obj: string, i: number) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-slate-50 rounded-2xl">
                  <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Não Conformidades */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
              <AlertTriangle className="size-3 text-red-500" /> Principais Não Conformidades
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {data.nao_conformidades.map((inspecao: any, i: number) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-primary/10 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2.5 rounded-xl",
                        inspecao.prioridade === 'Alta' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {inspecao.prioridade === 'Alta' ? <AlertTriangle className="size-5" /> : <CheckCircle2 className="size-5" />}
                      </div>
                      <div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10 text-primary/60 mb-1">NR-{inspecao.nr_relacionada}</Badge>
                        <h4 className="text-sm font-black text-primary uppercase leading-tight">{inspecao.descricao}</h4>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase border-none px-3 h-6",
                      inspecao.prioridade === 'Alta' ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
                    )}>
                      Prio: {inspecao.prioridade}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-dashed">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Consequência de Risco</p>
                      <p className="text-[11px] font-bold text-red-700">{inspecao.consequencia}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Recomendação NAI</p>
                      <p className="text-[11px] font-medium text-slate-600 italic">"{inspecao.recomendacoes}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo de Treinamentos */}
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" /> Cronograma de Treinamentos 2026
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-[9px] font-black text-primary uppercase bg-primary/5 p-2 rounded-lg text-center">Treinamentos Críticos</p>
                {data.treinamentos.criticos.map((trn: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                    <span className="font-bold text-slate-600">{trn.nome}</span>
                    <Badge variant="outline" className="text-[8px] font-black text-slate-400">{trn.validade}</Badge>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-[9px] font-black text-accent uppercase bg-accent/5 p-2 rounded-lg text-center">Específicos por Função</p>
                {data.treinamentos.especificos.map((trn: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                    <span className="font-bold text-slate-600">{trn.nome}</span>
                    <Badge variant="outline" className="text-[8px] font-black text-slate-400">Anual</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar de Ação */}
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
              
              <div className="space-y-4">
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Ao protocolar, a NAI analisará os dados da <strong>{header.empresa_atendida}</strong>, gerando:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-accent">
                    <CheckCircle2 className="size-3" /> Parecer Técnico Executivo
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-accent">
                    <CheckCircle2 className="size-3" /> Matriz de Adequação NR-12
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-accent">
                    <CheckCircle2 className="size-3" /> Histórico Multi-tenant
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <BotaoSalvarRelatorio relatorioDados={relatorioMock} />
              </div>
            </div>
          </Card>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/5 rounded-lg text-primary"><Info className="size-4" /></div>
              <h4 className="text-sm font-black text-primary uppercase tracking-tight">Próximos Passos</h4>
            </div>
            <div className="space-y-4">
              {data.proximos_passos.map((step: string, i: number) => (
                <div key={i} className="flex gap-3 items-start group">
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-primary transition-colors">{i+1}.</span>
                  <p className="text-[11px] font-medium text-slate-500 leading-tight italic">"{step}"</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-shadow border-none bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white shadow-sm"><ShieldCheck className="size-4" /></div>
              <h4 className="text-sm font-black text-primary uppercase">Selo de Auditoria</h4>
            </div>
            <p className="text-[10px] text-primary/70 leading-relaxed font-bold italic uppercase tracking-tighter">
              "NAI Forensic Engine: Validado em conformidade com as atualizações de 2026 das Normas Regulamentadoras."
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
