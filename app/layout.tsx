import type { Metadata } from 'next';
import { ThemeProvider, ThemeScript } from '@/lib/theme-context';
import { QuizProvider } from '@/lib/quiz-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'SitePronto — Crie seu site hoje. Sem mensalidade.',
  description:
    'Site profissional pronto em até 24h. Responda 3 perguntas, escolha o visual e publique — R$ 300 único, sem mensalidade. Garantia de 7 dias.',
  openGraph: {
    title: 'SitePronto — Crie seu site hoje. Sem mensalidade.',
    description:
      'Site profissional pronto em até 24h. R$ 300 único, sem mensalidade. Garantia de 7 dias.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'SitePronto',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SitePronto — Crie seu site hoje. Sem mensalidade.',
    description: 'Site profissional pronto em até 24h. R$ 300 único, sem mensalidade.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-surface text-on-surface antialiased">
        <QuizProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QuizProvider>
      </body>
    </html>
  );
}
