import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import * as React from 'react';
import { AppContent } from '@/components/layout/app-content';

/**
 * Server Component de Layout.
 * Fix: Mantém a estrutura HTML/BODY estática para evitar erros de hidratação (mismatch).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" />
        <title>NextCon - SST Intelligence</title>
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
