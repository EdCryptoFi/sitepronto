'use client';

import { useEffect } from 'react';

export default function ReferralTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref || !/^[a-zA-Z0-9_-]{3,30}$/.test(ref)) return;

    const code = ref.toUpperCase();
    localStorage.setItem('sitepronto-ref', code);

    // Cookie persists 30 days
    const expires = new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
    document.cookie = `sitepronto_ref=${code}; expires=${expires}; path=/; SameSite=Lax`;
  }, []);

  return null;
}
