import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import type { Metadata } from 'next';
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://acampamentosantarita.com.br'),
  title: {
    default: 'Acampamento Santa Rita — Comunidade de fé',
    template: '%s · Acampamento Santa Rita',
  },
  description:
    'Comunidade de fé que se reúne em acampamentos, retiros e encontros há mais de duas décadas. Cada nome é uma alma; cada inscrição, um passo.',
  openGraph: {
    title: 'Acampamento Santa Rita',
    description: 'Comunidade de fé que se reúne em acampamentos, retiros e encontros.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Acampamento Santa Rita',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acampamento Santa Rita',
    description: 'Comunidade de fé que se reúne em acampamentos, retiros e encontros.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${geist.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
