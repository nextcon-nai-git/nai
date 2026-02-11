"use client";

import * as React from "react";
import { 
  Bot, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  Zap, 
  Save, 
  Download, 
  History, 
  FileCheck,
  ChevronRight
} from "lucide-react";
import { gerarOrcamentoComNai } from "@/actions/nai-quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useStorage } from "@/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

const NEXTCON_LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/studio-8439299034-125c7.firebasestorage.app/o/public%2Fnextcon-logo-horizontal.png?alt=media";

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
  const storage = useStorage();
  
  const [formData, setFormData] = React.useState({
    nomeEmpresa: "",
    quantidadeFuncionarios: "",
    grauDeRisco: "1",
    necessidades: ""
  });
  
  const [loading, setLoading] = React.useState(false);
  const [salvando, setSalvando] = React.useState(false);
  const [orcamento, setOrcamento] = React.useState<OrcamentoGerado | null>(null);
  const [orcamentosEnviados, setOrcamentosEnviados] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "orcamentos"), orderBy("data", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrcamentosEnviados(docs);
    });
    return () => unsubscribe();
  }, [db]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOrcamento(null);

    try {
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
    } catch (error) {
      toast({ variant: "destructive", title: "Erro de Conexão", description: "Verifique sua internet." });
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarEGerarPDF() {
    if (!orcamento || !db || !storage) return;
    setSalvando(true);

    try {
      const docRef = await addDoc(collection(db, "orcamentos"), {
        empresa: formData.nomeEmpresa,
        funcionarios: formData.quantidadeFuncionarios,
        risco: formData.grauDeRisco,
        resumoNai: orcamento,
        status: "Enviado",
        data: serverTimestamp()
      });

      const pdf = new jsPDF();
      
      // Adiciona Logo da Nextcon
      try {
        pdf.addImage(NEXTCON_LOGO_URL, 'PNG', 20, 15, 60, 15);
      } catch (e) {
        console.warn("Logo não carregada no PDF");
      }

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 53, 107);
      pdf.setFontSize(18);
      pdf.text("Proposta Técnica SST", 190, 25, { align: 'right' });
      
      pdf.setDrawColor(0, 242, 255);
      pdf.setLineWidth(0.5);
      pdf.line(20, 35, 190, 35);

      pdf.setFontSize(11);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Cliente: ${formData.nomeEmpresa.toUpperCase()}`, 20, 45);
      pdf.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 20, 51);
      pdf.text(`ID da Proposta: #${docRef.id.substring(0, 8)}`, 20, 57);
      
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(0, 53, 107);
      let intro = pdf.splitTextToSize(`Análise NAI Intelligence: ${orcamento.mensagemIntrodutoria}`, 170);
      pdf.text(intro, 20, 70);

      let y = 80 + (intro.length * 5);
      pdf.setFont("helvetica", "bold");
      pdf.text("DETALHAMENTO TÉCNICO RECOMENDADO:", 20, y);
      y += 10;

      orcamento.servicosRecomendados.forEach(s => {
        if (y > 260) {
          pdf.addPage();
          y = 20;
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0, 53, 107);
        pdf.text(`• ${s.nomeServico}`, 20, y);
        pdf.text(`R$ ${s.valorEstimado.toFixed(2)}`, 190, y, { align: 'right' });
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        let just = pdf.splitTextToSize(s.justificativaLegal, 160);
        pdf.text(just, 25, y + 5);
        y += 15 + (just.length * 5);
      });

      y += 5;
      pdf.setDrawColor(241, 245, 249);
      pdf.line(20, y, 190, y);
      y += 15;

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 53, 107);
      pdf.text(`Total Implementação (Avulso):`, 20, y);
      pdf.text(`R$ ${orcamento.valorTotalAvulso.toFixed(2)}`, 190, y, { align: 'right' });
      
      if (orcamento.valorTotalMensal) {
        y += 10;
        pdf.setTextColor(16, 185, 129);
        pdf.text(`Mensalidade Gestão eSocial:`, 20, y);
        pdf.text(`R$ ${orcamento.valorTotalMensal.toFixed(2)}/mês`, 190, y, { align: 'right' });
      }

      const pdfBlob = pdf.output("blob");
      const storagePath = `orcamentos/${docRef.id}.pdf`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, pdfBlob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(docRef, { pdfUrl: downloadURL });

      toast({ title: "Proposta Protocolada!", description: "Dossiê com logo gerado e salvo no histórico." });
      setOrcamento(null);
      setFormData({ nomeEmpresa: "", quantidadeFuncionarios: "", grauDeRisco: "1", necessidades: "" });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Erro no Protocolo", description: "Falha ao salvar no banco." });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
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
                {loading ? "A NAI está calculando..." : "Gerar Orçamento NAI"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {!orcamento && !loading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 opacity-20 border-2 border-dashed rounded-[3rem] p-20 bg-white">
              <Bot className="size-24 text-primary" />
              <div className="space-y-2">
                <p className="text-xl font-black uppercase text-primary tracking-widest">Aguardando Dados</p>
                <p className="text-sm font-bold">Preencha os dados ao lado para a NAI montar a proposta perfeita.</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[3rem] shadow-inner">
              <Loader2 className="size-20 animate-spin text-primary opacity-20" />
              <div className="space-y-3">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-primary animate-pulse">Cruzando NRs e eSocial...</p>
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
                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Total Implementação</p>
                  <h2 className="text-4xl font-black text-primary font-headline tracking-tighter">
                    {orcamento.valorTotalAvulso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </h2>
                </div>
                {orcamento.valorTotalMensal && (
                  <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="size-20 text-accent" /></div>
                    <p className="text-[10px] font-black uppercase opacity-50 mb-2 tracking-widest">Gestão Mensal NAI</p>
                    <h2 className="text-4xl font-black text-accent font-headline tracking-tighter">
                      {orcamento.valorTotalMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h2>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleSalvarEGerarPDF}
                disabled={salvando}
                className="w-full h-16 bg-accent text-primary font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-accent/20 gap-3"
              >
                {salvando ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                {salvando ? "Salvando e Protocolando Dossiê..." : "Salvar e Gerar Proposta PDF"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-12 border-t space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-lg text-primary"><History className="size-5" /></div>
          <h2 className="text-xl font-headline font-black uppercase text-primary">Histórico de Propostas (Real-time)</h2>
        </div>

        {orcamentosEnviados.length === 0 ? (
          <div className="py-20 text-center opacity-20 border-2 border-dashed rounded-[3rem]">
            <FileCheck className="size-16 mx-auto mb-4" />
            <p className="font-black uppercase text-xs tracking-widest">Nenhum orçamento registrado ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orcamentosEnviados.map((orc) => (
              <Card key={orc.id} className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0">
                      <h3 className="font-black text-primary uppercase text-sm truncate" title={orc.empresa}>{orc.empresa}</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                        {orc.data?.toDate ? orc.data.toDate().toLocaleDateString('pt-BR') : 'Hoje'}
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black uppercase">ENVIADO</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Vidas</p>
                      <p className="text-xs font-bold text-primary">{orc.funcionarios}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Total</p>
                      <p className="text-xs font-bold text-primary">R$ {orc.resumoNai?.valorTotalAvulso?.toFixed(2)}</p>
                    </div>
                  </div>

                  {orc.pdfUrl ? (
                    <Button variant="outline" className="w-full h-11 rounded-xl gap-2 font-black uppercase text-[10px] border-primary/10 hover:bg-primary hover:text-white transition-all" asChild>
                      <a href={orc.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="size-3.5" /> Baixar Dossiê PDF
                      </a>
                    </Button>
                  ) : (
                    <Button disabled className="w-full h-11 rounded-xl gap-2 font-black uppercase text-[10px] opacity-50">
                      <Loader2 className="size-3.5 animate-spin" /> Gerando Link...
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}