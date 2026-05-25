'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Copy, Check, Loader2 } from 'lucide-react';
import type { WATemplate } from '@/lib/whatsapp-templates';

export default function WATemplates({
  businessName,
  segment,
  objective,
}: {
  businessName: string;
  segment: string;
  objective: string;
}) {
  const [templates, setTemplates] = useState<WATemplate[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/wa-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName, segment, objective }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (Array.isArray(data)) setTemplates(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [businessName, segment, objective]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-outline-variant bg-surface-low p-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle size={16} className="text-primary" />
          <h2 className="text-label-lg font-semibold">Mensagens prontas para WhatsApp</h2>
        </div>
        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
          <Loader2 size={14} className="animate-spin" /> Gerando mensagens personalizadas…
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) return null;

  return (
    <div className="mt-10 rounded-2xl border border-outline-variant bg-surface-low p-6 text-left">
      <div className="mb-1 flex items-center gap-2">
        <MessageCircle size={16} className="text-primary" />
        <h2 className="text-label-lg font-semibold">Mensagens prontas para WhatsApp</h2>
      </div>
      <p className="mb-5 text-label-sm text-on-surface-variant">
        Use estas mensagens no seu WhatsApp Business para receber clientes com profissionalismo.
      </p>
      <div className="space-y-3">
        {templates.map((t, i) => (
          <div key={i} className="rounded-xl border border-outline-variant bg-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-label-sm font-semibold text-on-surface">{t.label}</span>
              <button
                type="button"
                onClick={() => handleCopy(t.message, i)}
                className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                {copied === i ? <><Check size={11} className="text-green-500" /> Copiado</> : <><Copy size={11} /> Copiar</>}
              </button>
            </div>
            <p className="whitespace-pre-line text-label-sm text-on-surface-variant leading-relaxed">{t.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
