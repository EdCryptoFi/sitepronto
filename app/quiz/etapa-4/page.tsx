'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Legacy etapa-4 — redirects to the new preview page.
 * Preserves briefingId query param if present.
 */
function Etapa4RedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const briefingId = searchParams.get('id');

  useEffect(() => {
    if (briefingId) {
      router.replace(`/quiz/preview?id=${briefingId}`);
    } else {
      router.replace('/quiz');
    }
  }, [router, briefingId]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0f1117]">
      <p className="text-white/50">Redirecionando...</p>
    </div>
  );
}

export default function QuizEtapa4Redirect() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0f1117]">
        <p className="text-white/50">Redirecionando...</p>
      </div>
    }>
      <Etapa4RedirectInner />
    </Suspense>
  );
}
