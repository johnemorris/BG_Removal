import type { Metadata } from 'next';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientAppShell } from './ClientAppShell';

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
    <html lang="en" className="clearcut-inter">
      <head>
        <link rel="preload" href="/fonts/e4af272ccee01ff0-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-canvas text-structural selection:bg-teal-100 selection:text-teal-900">
        <ClientAppShell>
          {children}
        </ClientAppShell>
      </body>
    </html>
  );
}
