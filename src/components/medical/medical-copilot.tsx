"use client";

import * as React from "react";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

interface MedicalCopilotProps {
  pacienteId: string;
  className?: string;
}

export default function MedicalCopilot({ pacienteId, className }: MedicalCopilotProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: "1", role: "ai", content: "Olá, doutor(a). Sou a NAI. Como posso auxiliar na análise deste paciente hoje?" }
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userContent = input;
    setInput("");
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: userContent }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/medical-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagemMedico: userContent,
          pacienteId: pacienteId,
        }),
      });

      const data = await response.json();

      if (data.sucesso) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: data.resposta }]);
      } else {
        throw new Error(data.mensagem);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: "Desculpe, tive um problema ao acessar a base CID/Histórico agora." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-[550px] w-full border border-slate-100 rounded-[2rem] bg-white shadow-xl overflow-hidden", className)}>
      <div className="bg-primary p-5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Bot size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="font-black uppercase text-xs tracking-tight">Copilot Clínico NAI</h3>
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">IA Diagnostic Support</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[8px] border-white/20 text-white font-black uppercase">Live Link</Badge>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
              "flex items-center justify-center h-8 w-8 rounded-xl shrink-0 shadow-sm",
              msg.role === "user" ? "bg-primary text-white" : "bg-white text-slate-400 border"
            )}>
              {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl max-w-[85%] text-[11px] leading-relaxed font-medium shadow-sm animate-in fade-in duration-300",
              msg.role === "user" 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-white border text-slate-700 rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400">
            <div className="size-8 rounded-xl bg-white border flex items-center justify-center">
              <Loader2 size={14} className="animate-spin" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Cruzando CID e Histórico...</span>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2 shrink-0">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Dúvida clínica ou CID..."
          className="flex-1 h-12 bg-slate-50 border-none rounded-xl text-xs font-bold shadow-inner focus-visible:ring-primary/10"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="size-12 p-0 bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg shrink-0"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full border text-[10px]", className)}>
      {children}
    </span>
  );
}
