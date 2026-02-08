'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log do erro para monitoramento interno
    console.error('Nextcon Platform Error:', error);
  }, [error]);

  const handleReset = () => {
    if (typeof reset === 'function') {
      reset();
    } else {
      window.location.reload();
    }
  };

  const isPermissionError = error.message.includes('insufficient permissions') || error.name === 'FirebaseError';

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-500">
      <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive shadow-inner">
        <AlertCircle size={40} />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-primary uppercase font-headline tracking-tight">
          {isPermissionError ? 'Falha de Sincronização' : 'Instabilidade na Interface'}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
          {isPermissionError 
            ? 'Identificamos uma restrição de acesso aos dados. Isso pode ocorrer se sua sessão expirou ou se os privilégios da conta foram alterados.' 
            : 'Ocorreu um erro inesperado ao processar esta visualização. Nossa inteligência operacional já foi notificada.'}
        </p>
      </div>
      
      {isPermissionError && (
        <div className="bg-slate-50 p-4 rounded-xl text-[10px] font-mono text-left overflow-auto max-w-lg w-full border border-slate-200 opacity-70 shadow-inner">
          <p className="font-bold text-slate-400 uppercase mb-1">Diagnóstico Técnico:</p>
          {error.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={() => window.location.reload()} className="gap-2 font-black uppercase text-[10px] tracking-widest h-12 px-6">
          <RefreshCcw size={14} /> Atualizar Portal
        </Button>
        <Button onClick={handleReset} className="bg-primary font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-lg shadow-primary/20">
          Tentar Recuperação
        </Button>
      </div>
    </div>
  );
}
