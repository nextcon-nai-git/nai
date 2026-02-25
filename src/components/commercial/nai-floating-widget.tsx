
"use client";

import * as React from "react";
import { X, Sparkles, Zap, Loader2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

/**
 * @fileOverview Widget Flutuante da NAI (Assistente Comercial).
 * Consome a API pública /api/nai-widget para exibir o pitch de vendas.
 */

const NAI_AVATAR_URL = "https://firebasestorage.googleapis.com/v0/b/studio-8439299034-125c7.firebasestorage.app/o/logo%2FAvatar%20Nextcon%20NAI.png?alt=media";

export function NaiFloatingWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pitchData, setPitchData] = React.useState<any>(null);

  const fetchPitch = async () => {
    if (pitchData) return;
    setLoading(true);
    try {
      const response = await fetch("/api/nai-widget");
      const data = await response.json();
      if (data.sucesso) {
        setPitchData(data.dados);
      }
    } catch (error) {
      console.error("Erro ao carregar widget NAI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) fetchPitch();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Painel do Chat */}
      {isOpen && (
        <Card className="w-[350px] border-none shadow-2xl rounded-[2rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 bg-white">
          <CardHeader className="bg-primary text-white p-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                <Image 
                  src={NAI_AVATAR_URL} 
                  alt="NAI" 
                  width={40} 
                  height={40} 
                  className="object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tight">NAI Intelligence</CardTitle>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Assistente de Blindagem</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 max-h-[450px] overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <Loader2 className="size-8 animate-spin text-primary opacity-20" />
                <p className="text-[10px] font-black uppercase text-slate-400">Chamando NAI...</p>
              </div>
            ) : pitchData ? (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border shadow-inner">
                  <p className="text-xs italic text-slate-600 leading-relaxed font-medium">
                    "{pitchData.avatar.saudacao_inicial}"
                  </p>
                </div>

                <div className="space-y-3">
                  {pitchData.pilares_venda.map((pilar: any) => (
                    <div key={pilar.ordem} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-accent/30 transition-all group">
                      <h4 className="text-[11px] font-black text-primary uppercase mb-1 flex items-center gap-2">
                        <Zap className="size-3 text-accent" />
                        {pilar.titulo}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">
                        {pilar.resumo}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dashed space-y-4">
                  <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
                    {pitchData.cta_final}
                  </p>
                  <Button 
                    asChild
                    className="w-full h-12 bg-accent hover:bg-accent/90 text-primary font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg gap-2"
                  >
                    <Link href="/comercial" onClick={() => setIsOpen(false)}>
                      Solicitar Orçamento <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                Não foi possível carregar a inteligência NAI.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botão Flutuante humanizado com avatar NAI */}
      <button 
        onClick={handleToggle}
        className={cn(
          "h-16 px-8 rounded-full shadow-2xl transition-all duration-500 flex items-center gap-3 hover:scale-105 active:scale-95 group overflow-hidden border-2 border-white/20",
          isOpen ? "bg-primary text-white" : "gradient-nextcon text-white ring-4 ring-accent/10"
        )}
      >
        <div className="relative size-10 rounded-full overflow-hidden border-2 border-white/20 bg-[#090e24] flex items-center justify-center shrink-0">
          <Image 
            src={NAI_AVATAR_URL} 
            alt="NAI" 
            fill
            className="object-cover"
            sizes="40px"
          />
          {!isOpen && <span className="absolute top-0 right-0 size-2.5 bg-accent rounded-full border-2 border-primary animate-ping" />}
        </div>
        <span className="font-black uppercase text-xs tracking-widest">
          {isOpen ? "Fechar Assistente" : "Falar com a NAI"}
        </span>
      </button>
    </div>
  );
}
