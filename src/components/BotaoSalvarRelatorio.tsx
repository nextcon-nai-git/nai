'use client';

import * as React from 'react';
import { useState } from 'react';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { analyzeSafetyReport } from '@/ai/flows/report-analysis-flow';
import { salvarRelatorioComIA } from '@/lib/report-service';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/**
 * Componente BotaoSalvarRelatorio
 * Gerencia o ciclo de vida de análise via NAI AI e persistência no Firestore.
 */
export function BotaoSalvarRelatorio({ relatorioDados }: { relatorioDados: any }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const handleProcessarESalvar = async () => {
    if (!relatorioDados) {
      toast({ variant: "destructive", title: "Dados Ausentes", description: "Não há informações para processar." });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Chama a IA da Nextcon para gerar o parecer técnico
      const resumoIA = await analyzeSafetyReport(relatorioDados);
      
      // 2. Protocoliza o documento na NAI Cloud (Escrita não-bloqueante)
      await salvarRelatorioComIA(db, relatorioDados, resumoIA);

      setIsSuccess(true);
      toast({
        title: "Relatório Protocolado",
        description: "A NAI concluiu a auditoria e salvou o documento com sucesso.",
      });

      // Retorna ao estado original após visualização do sucesso
      setTimeout(() => setIsSuccess(false), 5000);

    } catch (error: any) {
      console.error("NAI Processing Error:", error);
      toast({
        variant: "destructive",
        title: "Falha na Engine NAI",
        description: "Ocorreu um erro ao processar a auditoria inteligente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleProcessarESalvar}
      disabled={isProcessing || isSuccess}
      className={cn(
        "flex items-center justify-center gap-3 px-8 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white shadow-xl transition-all duration-500 active:scale-95",
        isSuccess
          ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
          : "bg-primary hover:bg-primary/90 shadow-primary/20",
        (isProcessing || isSuccess) && "opacity-90 cursor-default"
      )}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
          Auditando com NAI AI...
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle2 className="w-5 h-5 text-accent animate-in zoom-in" />
          Relatório Salvo!
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 text-accent" />
          Processar Relatório com IA
        </>
      )}
    </button>
  );
}
