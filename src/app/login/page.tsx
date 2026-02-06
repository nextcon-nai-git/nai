'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldAlert, Building2, UserCircle, HeartPulse } from 'lucide-react';
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
    { email: 'admin@nextcon.com.br', role: 'Administrador', label: 'SUPER ADMIN', icon: ShieldAlert },
    { email: 'gestor@cliente.com.br', role: 'Gestor Cliente', label: 'CLIENT ADMIN', icon: Building2 },
    { email: 'colaborador@empresa.com.br', role: 'Colaborador', label: 'EMPLOYEE', icon: UserCircle },
    { email: 'clinica@parceira.com.br', role: 'Clínica', label: 'PROVIDER', icon: HeartPulse },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Lado Esquerdo: Brand */}
      <div className="hidden lg:flex lg:w-1/2 gradient-nextcon flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-20 opacity-10">
          <NextconLogo className="w-[800px] text-white" />
        </div>
        
        <div className="relative z-10 text-center space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl inline-block">
            <NextconLogo className="h-32 w-auto" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white font-headline tracking-tighter uppercase">Inteligência SST</h2>
            <p className="text-accent text-lg font-bold uppercase tracking-[0.3em]">Segurança e Saúde 360°</p>
          </div>
        </div>
        
        <div className="absolute bottom-12 text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">
          Plataforma NAI v2.6.0
        </div>
      </div>

      {/* Lado Direito: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <NextconLogo className="h-20 w-auto" />
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight uppercase">Bem-vindo</h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Acesse sua conta para gerenciar dados NextCon.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {demoUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => setEmail(u.email)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all gap-2 h-24 group shadow-sm",
                    email === u.email 
                      ? "bg-primary text-white border-primary ring-4 ring-primary/5" 
                      : "bg-white hover:bg-gray-100 border-gray-100 text-gray-400"
                  )}
                >
                  <u.icon className={cn("h-5 w-5 transition-colors", email === u.email ? "text-accent" : "text-gray-300 group-hover:text-primary")} />
                  <span className="text-[9px] font-black leading-none uppercase tracking-tighter">{u.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-300" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-12 h-12 bg-white border-gray-100 rounded-xl focus-visible:ring-primary/10 font-bold"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Chave de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-300" />
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-12 h-12 bg-white border-gray-100 rounded-xl focus-visible:ring-primary/10 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-primary text-white text-md font-black uppercase tracking-widest hover:bg-primary/90 transition-all rounded-2xl shadow-xl shadow-primary/20" disabled={loading}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Acessar Plataforma'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
              © 2026 NextCon Inteligência Ocupacional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
