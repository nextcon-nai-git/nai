'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldAlert, Building2, UserCircle, HeartPulse, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { NextconLogo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = React.useState('admin@nextcon.com.br');
  const [password, setPassword] = React.useState('2025');
  const [loading, setLoading] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    initiateEmailSignIn(auth, email, password, (error) => {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Verifique suas credenciais.',
      });
    });
  };

  const demoUsers = [
    { email: 'admin@nextcon.com.br', label: 'ADMIN', icon: ShieldAlert },
    { email: 'gestor@cliente.com.br', label: 'CLIENTE', icon: Building2 },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Lado Esquerdo: Identidade do Site */}
      <div className="hidden lg:flex lg:w-3/5 gradient-nextcon flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070')] bg-cover bg-center" />
        </div>
        
        <div className="relative z-10 text-center max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-white/10 backdrop-blur-md p-12 rounded-[3rem] border border-white/20 shadow-2xl inline-block mb-6">
            <NextconLogo className="h-32 w-auto text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white font-headline tracking-tighter leading-none">INTELIGÊNCIA OCUPACIONAL</h2>
            <p className="text-accent text-xl font-medium tracking-[0.2em] uppercase">SST & Engenharia 360°</p>
          </div>
          <div className="pt-8 flex justify-center gap-8 opacity-60">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">2026</p>
              <p className="text-[10px] text-white/70 uppercase font-black tracking-widest">Base Legal</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">NAI</p>
              <p className="text-[10px] text-white/70 uppercase font-black tracking-widest">IA Motor</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">
          NextCon Group • Brazil 
        </div>
      </div>

      {/* Lado Direito: Login */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-10">
          <div className="lg:hidden flex justify-center mb-10">
            <NextconLogo className="h-20 w-auto text-primary" />
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-4xl font-black text-primary font-headline tracking-tight uppercase">Portal NAI</h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Acesse o sistema de gestão estratégica de segurança e saúde do trabalho.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="flex gap-3 justify-center lg:justify-start">
              {demoUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => setEmail(u.email)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all h-14 group shadow-sm",
                    email === u.email 
                      ? "bg-primary text-white border-primary ring-8 ring-primary/5" 
                      : "bg-white hover:bg-gray-100 border-gray-100 text-gray-400"
                  )}
                >
                  <u.icon className={cn("h-4 w-4", email === u.email ? "text-accent" : "text-gray-300")} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{u.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-primary/10 font-bold shadow-inner"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">Chave de Acesso</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-primary/10 font-bold shadow-inner"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-16 bg-primary text-white text-md font-black uppercase tracking-widest hover:bg-primary/90 transition-all rounded-2xl shadow-2xl shadow-primary/20 gap-3" disabled={loading}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <Sparkles className="size-5 text-accent" />
                  Entrar no Sistema
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-10">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              © 2026 NextCon Saúde Empresarial • Tecnology by NAI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}