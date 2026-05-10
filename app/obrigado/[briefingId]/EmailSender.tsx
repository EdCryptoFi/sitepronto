'use client';

import { useEffect } from 'react';

export default function EmailSender({ briefingId }: { briefingId: string }) {
  useEffect(() => {
    const sentKey = `sitepronto-email-sent-${briefingId}`;
    if (localStorage.getItem(sentKey)) return;

    const email = localStorage.getItem('sitepronto-payer-email');
    if (!email) return;

    localStorage.setItem(sentKey, '1');

    fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ briefingId, email }),
    }).catch(() => {});
  }, [briefingId]);

  return null;
}
