'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldAlert, UserCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;

      // Se for o e-mail oficial, garante o papel de SUPER_ADMIN
      if (email.toLowerCase() === 'nextcon@nextconsaude.com.br') {
        const userRef = doc(db, "users", loggedUser.uid);
        await setDoc(userRef, {
          id: loggedUser.uid,
          email: loggedUser.email,
          role: 'SUPER_ADMIN',
          name: 'Time Nextcon',
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      router.push('/');
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Falha no Acesso',
        description: 'Verifique suas credenciais Nextcon.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001F3F] p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-primary uppercase tracking-tighter">NAI</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Inteligência em SST 2026</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail Corporativo</label>
              <Input 
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="h-14 bg-slate-50 border-none rounded-2xl font-bold px-6 shadow-inner" 
                placeholder="ex: nextcon@nextconsaude.com.br" required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha</label>
              <Input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="h-14 bg-slate-50 border-none rounded-2xl font-bold px-6 shadow-inner" 
                placeholder="••••••••" required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <ShieldAlert className="size-5 text-accent" />}
            Entrar no Portal
          </Button>
        </form>

        <div className="pt-6 border-t flex items-center justify-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">
          <Globe className="size-3" /> NAI Cloud Infrastructure
        </div>
      </div>
    </div>
  );
}
