"use client";

import * as React from "react";
import { Bot, FileText, CheckCircle2, AlertTriangle, Loader2, Sparkles, Zap, Building2, Users, TrendingUp } from "lucide-react";
import { gerarOrcamentoComNai } from "@/actions/nai-quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";

type OrcamentoGerado = {
  mensagemIntrodutoria: string;
  servicosRecomendados: {
    categoria: string;
    nomeServico: string;
    justificativaLegal: string;
    valorEstimado: number;
  }[];
  valorTotalMensal?: number;
  valorTotalAvulso: number;
  dicaDaNai: string;
};

export function NaiQuoteComponent() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  
  const [formData, setFormData] = React.useState({
    nomeEmpresa: "",
    quantidadeFuncionarios: "",
    grauDeRisco: "1",
    necessidades: ""
  });
  
  const [loading, setLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [orcamento, setOrcamento] = React.useState<OrcamentoGerado | null>(null);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOrcamento(null);

    const res = await gerarOrcamentoComNai({
      nomeEmpresa: formData.nomeEmpresa,
      quantidadeFuncionarios: Number(formData.quantidadeFuncionarios),
      grauDeRisco: Number(formData.grauDeRisco) as 1 | 2 | 3 | 4,
      necessidades: formData.necessidades
    });

    if (res.sucesso && res.orcamento) {
      setOrcamento(res.orcamento as OrcamentoGerado);
      toast({ title: "Análise Concluída", description: "A NAI montou sua recomendação técnica." });
    } else {
      toast({ variant: "destructive", title: "Falha na NAI", description: res.mensagem });
    }

    setLoading(false);
  }

  async function handleSaveProposal() {
    if (!db || !profile || !orcamento) return;
    setIsSaving(true);
    try {
      const colRef = collection(db, "companies", profile.companyId || "leads", "proposals");
      await addDocumentNonBlocking(colRef, {
        userId: user?.uid,
        userName: profile.name,
        source: 'ai',
        data: orcamento,
        totalValue: orcamento.valorTotalAvulso,
        status: "PENDENTE",
        createdAt: new Date().toISOString()
      });
      toast({ title: "Proposta Salva!", description: "O orçamento da NAI foi registrado no sistema." });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {/* FORMULÁRIO */}
      <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden h-fit">
        <div className="p-8 bg-primary text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg"><Sparkles className="size-5 text-accent" /></div>
            <h3 className="text-xl font-headline font-black uppercase">Dados para Análise</h3>
          </div>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-tight">A NAI cruzará riscos e NRs para seu orçamento.</p>
        </div>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Empresa</label>
              <Input 
                required
                className="h-12 bg-slate-50 border-none rounded-xl font-bold shadow-inner" 
                placeholder="Ex: Construtora Alfa"
                value={formData.nomeEmpresa}
                onChange={e => setFormData({...formData, nomeEmpresa: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vidas</label>
                <Input 
                  required type="number" min="1"
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold shadow-inner" 
                  value={formData.quantidadeFuncionarios}
                  onChange={e => setFormData({...formData, quantidadeFuncionarios: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Grau de Risco</label>
                <select 
                  className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold shadow-inner"
                  value={formData.grauDeRisco}
                  onChange={e => setFormData({...formData, grauDeRisco: e.target.value})}
                >
                  <option value="1">1 - Baixo</option>
                  <option value="2">2 - Médio</option>
                  <option value="3">3 - Alto</option>
                  <option value="4">4 - Muito Alto</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Necessidades</label>
              <Textarea 
                required
                className="min-h-[120px] bg-slate-50 border-none rounded-2xl p-4 font-medium shadow-inner" 
                placeholder="Ex: Preciso de laudos e treinamentos para uma obra de 6 meses..."
                value={formData.necessidades}
                onChange={e => setFormData({...formData, necessidades: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Zap className="size-5 text-accent" />}
              {loading ? "Calculando..." : "Gerar Orçamento NAI"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RESULTADO */}
      <div className="lg:col-span-2">
        {!orcamento && !loading && (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 opacity-20 border-2 border-dashed rounded-[3rem] p-20 bg-white">
            <Bot className="size-24 text-primary" />
            <div className="space-y-2">
              <p className="text-xl font-black uppercase text-primary tracking-widest">Aguardando Dados</p>
              <p className="text-sm font-bold">Descreva a empresa para que a NAI monte a proposta perfeita.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[3rem] shadow-inner">
            <div className="relative">
              <Loader2 className="size-20 animate-spin text-primary opacity-20" />
              <Bot className="size-10 text-primary absolute inset-0 m-auto animate-bounce" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-primary animate-pulse">NAI Cruzando Base Legal 2026...</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Calculando eSocial, Insalubridade e Treinamentos</p>
            </div>
          </div>
        )}

        {orcamento && !loading && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <Card className="border-none shadow-xl bg-blue-50/50 rounded-[2.5rem] p-8 border-2 border-blue-100">
              <div className="flex gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm h-fit"><Sparkles className="size-6 text-accent" /></div>
                <p className="text-sm italic text-blue-900 font-medium leading-relaxed">"{orcamento.mensagemIntrodutoria}"</p>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {orcamento.servicosRecomendados.map((svc, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary/20 transition-all">
                  <div className="flex gap-4 flex-1">
                    <div className="p-3 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors h-fit">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 mb-1">{svc.categoria}</Badge>
                      <h4 className="font-black text-primary uppercase text-sm tracking-tight">{svc.nomeServico}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium italic mt-1">{svc.justificativaLegal}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-6 py-3 rounded-2xl border font-black text-primary shadow-inner">
                    {svc.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg bg-white rounded-[2.5rem] p-8 text-center flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Total Implementação</p>
                <h2 className="text-4xl font-black text-primary font-headline tracking-tighter">
                  {orcamento.valorTotalAvulso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h2>
              </Card>
              {orcamento.valorTotalMensal && (
                <Card className="border-none shadow-2xl bg-primary text-white rounded-[2.5rem] p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="size-20 text-accent" /></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase opacity-50 mb-2 tracking-widest">Gestão Mensal NAI</p>
                    <h2 className="text-4xl font-black text-accent font-headline tracking-tighter">
                      {orcamento.valorTotalMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h2>
                  </div>
                </Card>
              )}
            </div>

            <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-200 flex gap-4">
              <div className="p-2 bg-amber-500 text-white rounded-xl h-fit shadow-lg shadow-amber-500/20"><AlertTriangle className="size-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-amber-700 mb-1 tracking-widest">Dica Estratégica NAI</p>
                <p className="text-xs text-amber-800 font-bold leading-relaxed">{orcamento.dicaDaNai}</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border-primary text-primary" onClick={() => setOrcamento(null)}>
                Refazer Simulação
              </Button>
              <Button 
                onClick={handleSaveProposal}
                disabled={isSaving}
                className="flex-1 h-14 rounded-2xl bg-accent text-primary font-black uppercase text-[10px] tracking-widest shadow-xl shadow-accent/20"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
                Salvar Proposta NAI
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
