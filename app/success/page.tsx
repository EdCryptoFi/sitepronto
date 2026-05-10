'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{ id: string; amount: number; domain: string } | null>(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    if (paymentId && status === 'approved') {
      setPaymentData({ id: paymentId, amount: 300, domain: 'seudominio.com.br' });
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-12 max-w-3xl px-6">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={32} />
          </div>
        </div>

        <h1 className="mb-4 text-headline-lg font-bold">Pagamento Aprovado!</h1>

        <p className="mx-auto mb-8 max-w-md text-body-md text-on-surface-variant">
          Seu pagamento foi processado com sucesso. Em breve entraremos em contato para dar
          continuidade à criação do seu site.
        </p>

        {paymentData && (
          <div className="card mx-auto mb-8 max-w-md">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">ID do Pagamento:</span>
                <span className="font-mono text-sm">{paymentData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Valor:</span>
                <span className="font-semibold">R$ {paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-semibold text-green-600">Aprovado</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="btn-primary">
            Voltar ao início <ArrowLeft size={16} className="ml-2 rotate-180" />
          </a>
          <button onClick={() => window.print()} className="btn-ghost">
            Imprimir recibo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen pb-24 pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-60"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(0, 74, 198, 0.08), transparent 70%)' }}
      />
      <div className="relative mx-auto flex max-w-3xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
            <Sparkles size={16} />
          </span>
          <span className="text-title-lg font-bold tracking-tight">
            SitePronto<span className="text-primary">.</span>
          </span>
        </a>
        <ThemeToggle />
      </div>
      <Suspense fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
