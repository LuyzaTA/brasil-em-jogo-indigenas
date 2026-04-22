import './globals.css';
import type { ReactNode } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AudioProvider } from '../contexts/AudioContext';

export const metadata = {
  title: 'Brasil em Jogo — Povos Indígenas',
  description: 'O Território. O Tempo. Os Dados.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col bg-[#f4f0e8] text-[#181818]">
        <LanguageProvider>
          <AudioProvider>
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </AudioProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
