"use client";

import * as React from "react";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    const userMessageId = Date.now().toString();
    const aiMessageId = (Date.now() + 1).toString();
    
    setInput("");
    
    // Adiciona mensagem do usuário e cria placeholder para a resposta da IA
    setMessages((prev) => [
      ...prev, 
      { id: userMessageId, role: "user", content: userContent },
      { id: aiMessageId, role: "ai", content: "" }
    ]);
    
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

      if (!response.ok) throw new Error("Falha na conexão");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream inacessível");

      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Atualiza a última mensagem da IA progressivamente
        setMessages((prev) => 
          prev.map(msg => msg.id === aiMessageId ? { ...msg, content: accumulatedText } : msg)
        );
      }

    } catch (error) {
      setMessages((prev) => 
        prev.map(msg => msg.id === aiMessageId ? { ...msg, content: "Desculpe, tive um problema ao acessar a base CID/Histórico agora." } : msg)
      );
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
        <Badge variant="outline" className="text-[8px] border-white/20 text-white font-black uppercase h-6">Live Stream</Badge>
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
              {msg.content || (msg.role === 'ai' && isLoading && <div className="flex gap-1"><div className="size-1 bg-slate-300 rounded-full animate-bounce" /><div className="size-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="size-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" /></div>)}
            </div>
          </div>
        ))}
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
          {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send size={18} />}
        </Button>
      </form>
    </div>
  );
}
