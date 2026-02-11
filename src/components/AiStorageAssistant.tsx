
"use client";

import * as React from "react";
import { executarComandoStorage } from "@/actions/ia-storage";
import { Bot, FolderPlus, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStorage } from "@/firebase";
import { ref, uploadString } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Assistente de Pastas IA
 * Componente que utiliza IA para organizar a estrutura de arquivos no Storage.
 * A gravação é feita via Client SDK para respeitar as Security Rules.
 */

export default function AiStorageAssistant() {
  const { toast } = useToast();
  const storage = useStorage();
  const [comando, setComando] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resultado, setResultado] = React.useState<{ sucesso: boolean; mensagem: string } | null>(null);

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!comando.trim() || !storage) return;

    setLoading(true);
    setResultado(null);

    // 1. Processamento via IA (Server Action)
    const res = await executarComandoStorage(comando);

    if (res.sucesso && res.dados) {
      try {
        // 2. Execução da criação no Cliente (Segurança Multi-tenant)
        const fileRef = ref(storage, res.dados.caminhoStorage);
        await uploadString(fileRef, res.dados.placeholderContent, 'raw');

        setResultado({ 
          sucesso: true, 
          mensagem: `🚀 Magia feita! Pasta organizada para "${res.dados.nomeEmpresa}" no caminho: ${res.dados.caminhoStorage}` 
        });
        setComando("");
        
        toast({
          title: "Organização Concluída",
          description: "A estrutura de pastas foi criada com sucesso.",
        });
      } catch (error: any) {
        setResultado({ 
          sucesso: false, 
          mensagem: "Erro de Permissão: Você não tem autorização para criar arquivos nesta raiz do Storage." 
        });
      }
    } else {
      setResultado({ 
        sucesso: false, 
        mensagem: res.mensagem || "Erro na interpretação da IA." 
      });
    }

    setLoading(false);
  }

  return (
    <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden max-w-2xl w-full">
      <CardHeader className="bg-primary/5 pb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
            <Bot className="size-6 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl font-headline font-black text-primary uppercase">Assistente de Pastas NAI</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Organização inteligente do Storage via comando de texto.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleEnviar} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">O que você quer arquivar?</label>
            <div className="flex gap-3">
              <Input
                value={comando}
                onChange={(e) => setComando(e.target.value)}
                placeholder="Ex: Crie a pasta do projeto NR-18 para a COCEL, CNPJ 75.805.895/0001-30"
                className="h-14 bg-slate-50 border-none rounded-2xl shadow-inner font-medium focus-visible:ring-primary/10"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading || !comando}
                className="h-14 px-8 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl gap-2 hover:opacity-90 transition-all"
              >
                {loading ? <Loader2 className="size-5 animate-spin" /> : <FolderPlus className="size-5 text-accent" />}
                {loading ? "NAI Pensando..." : "Criar"}
              </Button>
            </div>
          </div>

          {resultado && (
            <div className={cn(
              "p-5 rounded-2xl border flex gap-4 animate-in slide-in-from-top-2 duration-300",
              resultado.sucesso ? "bg-accent/10 border-accent/20 text-primary" : "bg-red-50 border-red-100 text-red-700"
            )}>
              {resultado.sucesso ? <CheckCircle2 className="size-5 text-accent shrink-0" /> : <AlertCircle className="size-5 text-red-500 shrink-0" />}
              <p className="text-xs font-bold leading-relaxed italic">"{resultado.mensagem}"</p>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-dashed flex items-center gap-3">
          <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Sparkles className="size-4 text-blue-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            Dica: Informe o **CNPJ** para uma organização 100% precisa.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
