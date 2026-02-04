'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldAlert, Building2, UserCircle, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
    { email: 'admin@nextcon.com.br', role: 'Administrador Nextcon', label: 'SUPER ADMIN', icon: ShieldAlert },
    { email: 'gestor@cliente.com.br', role: 'Gestor de Empresa', label: 'CLIENT ADMIN', icon: Building2 },
    { email: 'colaborador@empresa.com.br', role: 'Colaborador', label: 'EMPLOYEE', icon: UserCircle },
    { email: 'clinica@parceira.com.br', role: 'Prestador / Clínica', label: 'PROVIDER', icon: HeartPulse },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-14 w-14 text-[#090e24]">
            <NextconLogo className="h-full w-full" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-black text-[#090e24] tracking-tighter leading-none font-headline">NEXTCON</h1>
            <p className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-[0.3em]">Saúde Empresarial</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden">
        <div className="bg-[#090e24] p-8 text-center">
          <h2 className="text-2xl font-black text-white font-headline uppercase tracking-tight">Plataforma SST</h2>
          <p className="text-white/50 text-xs mt-1 font-bold">INTELIGÊNCIA EM SEGURANÇA E SAÚDE</p>
        </div>

        <form onSubmit={handleLogin}>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center block mb-4">Selecione seu Perfil de Acesso</label>
              <div className="grid grid-cols-2 gap-2">
                {demoUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => setEmail(u.email)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all gap-2 h-28 group",
                      email === u.email 
                        ? "bg-[#090e24] text-white border-[#090e24] ring-4 ring-[#f59e0b]/20" 
                        : "bg-white hover:bg-gray-50 border-gray-100"
                    )}
                  >
                    <u.icon className={cn("h-6 w-6 transition-colors", email === u.email ? "text-[#f59e0b]" : "text-gray-400 group-hover:text-primary")} />
                    <div>
                      <p className="text-[10px] font-black leading-none mb-1 opacity-60">{u.label}</p>
                      <p className="text-[11px] font-bold leading-tight">{u.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-dashed">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-10 h-11 bg-muted/20 border-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-10 h-11 bg-muted/20 border-none"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0">
            <Button type="submit" className="w-full bg-[#090e24] h-14 text-lg font-black uppercase tracking-widest hover:bg-[#090e24]/90 transition-all shadow-xl" disabled={loading}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Entrar no Sistema'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        © 2026 Nextcon Inteligência Ocupacional
      </p>
    </div>
  );
}
