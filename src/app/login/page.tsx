'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldAlert, Building2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { NextconLogo } from '@/components/ui/logo';

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
    { email: 'admin@nextcon.com.br', role: 'Administrador', icon: ShieldAlert },
    { email: 'cliente@empresa.com.br', role: 'Cliente', icon: Building2 },
    { email: 'colaborador@trabalho.com.br', role: 'Colaborador', icon: UserCircle },
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
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Acesso Rápido (Demo)</label>
              <div className="grid grid-cols-1 gap-2">
                {demoUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => setEmail(u.email)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      email === u.email ? "bg-[#090e24] text-white border-[#090e24]" : "bg-white hover:bg-gray-50"
                    )}
                  >
                    <u.icon className={cn("h-4 w-4", email === u.email ? "text-[#f59e0b]" : "text-gray-400")} />
                    <div>
                      <p className="text-xs font-bold">{u.role}</p>
                      <p className="text-[9px] opacity-70">{u.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0">
            <Button type="submit" className="w-full bg-[#090e24] h-14 text-lg font-black uppercase tracking-widest" disabled={loading}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Entrar na Unidade'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        © 2024 Nextcon Inteligência Ocupacional
      </p>
    </div>
  );
}