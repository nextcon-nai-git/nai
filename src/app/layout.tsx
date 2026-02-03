
import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'MAIN NextCon SST',
  description: 'Occupational Safety and Health Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-svh">
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full min-h-svh overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-auto bg-background p-6 md:p-8">
              {children}
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
