import type { Metadata } from 'next';
import { ThemeProvider, ThemeScript } from '@/lib/theme-context';
import { QuizProvider } from '@/lib/quiz-context';
import ReferralTracker from '@/components/ReferralTracker';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

const SITE_URL = 'https://sitepronto.com.br';

export const metadata: Metadata = {
  title: 'SitePronto — Site profissional hoje. Sem mensalidade.',
  description:
    'Crie seu site profissional em até 24h por apenas R$ 300 — pagamento único, hospedagem 12 meses inclusa, sem mensalidade. Responda 3 perguntas e publique hoje.',
  keywords: [
    'criar site',
    'site para empresa',
    'site profissional',
    'site sem mensalidade',
    'site barato',
    'criar site para restaurante',
    'criar site para clínica',
    'criar site para loja',
    'site pronto',
    'site em 24 horas',
  ],
  authors: [{ name: 'SitePronto' }],
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'SitePronto — Site profissional hoje. Sem mensalidade.',
    description:
      'Site profissional pronto em até 24h. R$ 300 único, hospedagem 12 meses inclusa, sem mensalidade. Garantia de 7 dias.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'SitePronto',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SitePronto — Site profissional hoje. Sem mensalidade.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'SitePronto',
                url: SITE_URL,
                description: 'Site profissional pronto em até 24h — R$ 300 único, sem mensalidade.',
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer support',
                  availableLanguage: 'Portuguese',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: 'Site Profissional SitePronto',
                description: 'Site profissional pronto em até 24h com hospedagem inclusa por 12 meses.',
                brand: { '@type': 'Brand', name: 'SitePronto' },
                offers: {
                  '@type': 'Offer',
                  price: '300.00',
                  priceCurrency: 'BRL',
                  availability: 'https://schema.org/InStock',
                  url: `${SITE_URL}/quiz`,
                  priceValidUntil: '2026-12-31',
                  seller: { '@type': 'Organization', name: 'SitePronto' },
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '5',
                  reviewCount: '300',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'Quanto custa um site no SitePronto?',
                    acceptedAnswer: { '@type': 'Answer', text: 'R$ 300 à vista (único, sem mensalidade) ou 3× R$ 125 no cartão. Hospedagem inclusa por 12 meses. Domínio adquirido separadamente pelo cliente.' },
                  },
                  {
                    '@type': 'Question',
                    name: 'Em quanto tempo meu site fica no ar?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Em até 24h após a confirmação do pagamento. Em horário comercial, costumamos publicar em poucas horas.' },
                  },
                  {
                    '@type': 'Question',
                    name: 'Preciso de hospedagem separada?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Não. A hospedagem está inclusa nos R$ 300 por 12 meses. Após esse período, a renovação é de R$ 300/ano. O domínio é adquirido e pago separadamente pelo cliente.' },
                  },
                ],
              },
            ]),
          }}
        />
        <GoogleAnalytics />
        <ReferralTracker />
        <QuizProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QuizProvider>
      </body>
    </html>
  );
}
