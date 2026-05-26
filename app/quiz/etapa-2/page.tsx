'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy etapa-2 — redirects to the new simplified quiz flow.
 * The old 4-step quiz has been consolidated into 2 steps:
 *   Step 1: /quiz (name + description + email)
 *   Step 2: /quiz/preview (preview + customize + checkout)
 */
export default function QuizEtapa2Redirect() {
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
