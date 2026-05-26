'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy etapa-3 — redirects to the new simplified quiz flow.
 */
export default function QuizEtapa3Redirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/quiz');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-on-surface-variant">Redirecionando...</p>
    </div>
  );
}
