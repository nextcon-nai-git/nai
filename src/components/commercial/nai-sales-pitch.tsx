
"use client";

import * as React from "react";
import { ShieldPlus, CircleDollarSign, HardHat, Sparkles, ChevronRight, Zap, Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";

const ICON_MAP: Record<string, any> = {
  "shield_health": ShieldPlus,
  "attach_money_block": CircleDollarSign,
  "security_hard_hat": HardHat
};

export function NaiSalesPitch() {
  const db = useFirestore();
  const pitchRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, "config_nai_avatar", "pitch_vendas_padrao");
  }, [db]);

  const { data: pitch, isLoading } = useDoc(pitchRef);
  const [expandedPilar, setExpandedPilar] = React.useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-primary/5 rounded-[2.5rem] border animate-pulse">
        <Loader2 className="size-8 animate-spin text-primary opacity-20 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Chamando a NAI...</p>
      </div>
    );
  }

  const data = pitch || {
    avatar: { nome: "NAI", titulo: "Inteligência Nextcon", saudacao_inicial: "Olá. Sou a NAI. Vamos blindar sua operação?" },
    pilares_venda: [],
    cta_final: "Termine seu orçamento."
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Balão de Fala e Avatar */}
      <div className="flex items-start gap-5 p-6 bg-white rounded-[2.5rem] border shadow-sm relative group">
        <div className="relative shrink-0 mt-2">
          <div className="size-16 rounded-[1.5rem] bg-[#090e24] flex items-center justify-center overflow-hidden shadow-xl border-2 border-[#00f2ff]/20">
            {data.avatar.imagem_url ? (
              <Image 
                src={data.avatar.imagem_url} 
                alt="Avatar NAI" 
                width={64} 
                height={64} 
                className="object-cover"
                priority
              />
            ) : (
              <span className="text-white font-black text-3xl">N</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 size-5 bg-accent rounded-full border-2 border-white flex items-center justify-center">
            <Zap className="size-3 text-primary fill-current" />
          </div>
        </div>
        
        <div className="flex-1 space-y-2 relative">
          <div className="bg-slate-50 p-4 rounded-3xl rounded-tl-none border shadow-inner relative">
            <div className="absolute -left-2 top-0 size-4 bg-slate-50 border-l border-t rotate-45" style={{ left: '-8px' }}></div>
            <p className="text-xs italic text-slate-600 leading-relaxed font-medium">
              "{data.avatar.saudacao_inicial}"
            </p>
          </div>
          <div className="pl-2">
            <h4 className="text-sm font-black text-primary uppercase tracking-tight leading-none">{data.avatar.nome}</h4>
            <p className="text-[9px] font-black text-accent uppercase tracking-widest mt-1">{data.avatar.titulo}</p>
          </div>
        </div>
      </div>

      {/* Pilares de Venda Interativos */}
      <div className="space-y-3">
        {data.pilares_venda.map((pilar: any) => {
          const Icon = ICON_MAP[pilar.icone] || Sparkles;
          const isExpanded = expandedPilar === pilar.ordem;

          return (
            <Card 
              key={pilar.ordem} 
              className={cn(
                "border-none shadow-sm transition-all duration-500 cursor-pointer rounded-3xl overflow-hidden group",
                isExpanded ? "ring-2 ring-accent bg-accent/5 shadow-xl scale-[1.02]" : "bg-white hover:ring-2 ring-[#00f2ff]/20"
              )}
              onClick={() => setExpandedPilar(isExpanded ? null : pilar.ordem)}
            >
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl transition-colors h-fit shadow-inner",
                    isExpanded ? "bg-accent text-white" : "bg-slate-50 text-primary group-hover:bg-primary group-hover:text-white"
                  )}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h5 className="font-black text-primary uppercase text-xs tracking-tight">{pilar.titulo}</h5>
                      <ChevronRight className={cn("size-4 text-slate-300 transition-transform duration-500", isExpanded && "rotate-90 text-accent")} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                      {pilar.resumo}
                    </p>
                    
                    <div className={cn(
                      "grid transition-all duration-500 ease-in-out",
                      isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                    )}>
                      <div className="overflow-hidden">
                        <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-accent/30">
                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                            {pilar.texto_completo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA Final */}
      <div className="p-6 bg-[#090e24] rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl group hover:shadow-accent/10 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-45 transition-transform duration-1000">
          <Sparkles className="size-20 text-[#00f2ff]" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          <Badge className="bg-accent/20 text-accent border-none text-[8px] font-black uppercase tracking-[0.3em]">Blindagem 2026</Badge>
          <h3 className="text-xs font-bold leading-tight uppercase tracking-widest">{data.cta_final}</h3>
          <div className="mt-2 flex items-center gap-2 text-[9px] font-black text-accent/60 uppercase">
            <MessageSquare className="size-3" /> NAI Forensic Sales Engine
          </div>
        </div>
      </div>
    </div>
  );
}
