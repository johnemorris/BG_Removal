import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientAppShell } from './ClientAppShell';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'ClearCut AI - Free AI Background Remover & Photo Studio',
  description: '100% automated background removal in seconds. Create pure white e-commerce product photos, add realistic AI drop shadows, and export in 4K resolution.',
  keywords: ['background remover', 'remove background', 'white background for amazon', 'pixelcut alternative', 'remove bg alternative', 'transparent png maker'],
  openGraph: {
    title: 'ClearCut AI - Professional AI Background Removal',
    description: 'Instant, privacy-first background removal for e-commerce, portraits, and developers.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-canvas text-structural selection:bg-teal-100 selection:text-teal-900">
        <ClientAppShell>
          {children}
        </ClientAppShell>
      </body>
    </html>
  );
}
