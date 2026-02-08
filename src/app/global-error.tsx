'use client';

import * as React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleReset = () => {
    if (typeof reset === 'function') {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <html>
      <body className="bg-[#003366] text-white flex flex-col items-center justify-center h-screen p-10 text-center font-sans">
        <div className="space-y-6 max-w-lg">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Erro Crítico de Sistema</h1>
          <p className="opacity-70 font-medium">Ocorreu uma falha fatal no motor da plataforma. Por favor, reinicie a aplicação.</p>
          <button 
            onClick={handleReset}
            className="bg-accent text-primary font-black uppercase text-xs py-4 px-10 rounded-2xl shadow-2xl transition-transform active:scale-95"
          >
            Reiniciar Nextcon Engine
          </button>
        </div>
      </body>
    </html>
  );
}
