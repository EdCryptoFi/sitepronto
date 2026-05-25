'use client';

import { useState, useEffect } from 'react';
import { Settings, CreditCard, Percent, FileText, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function ConfiguracoesPage() {
  const [sitePrice, setSitePrice] = useState('300');
  const [commission, setCommission] = useState('50');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        if (data.site_price) setSitePrice(data.site_price);
        if (data.commission_default) setCommission(data.commission_default);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(section: string, payload: Record<string, string>) {
    setSaving(section);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Erro ao salvar');
      } else {
        setSaved(section);
        setTimeout(() => setSaved(null), 3000);
      }
    } catch {
      setError('Erro de conexão');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface lg:pl-64">
      <AdminSidebar />

      <div className="pb-20 pt-6 lg:pb-6">
        <div className="px-6">
          <h1 className="text-headline-sm font-bold">Configurações da Plataforma</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Gerencie precificação e integrações.
          </p>
          {loading && (
            <div className="mt-4 flex items-center gap-2 text-label-sm text-on-surface-variant">
              <Loader2 size={14} className="animate-spin" /> Carregando configurações…
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-700">
              <AlertCircle size={15} /> {error}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-6 px-6">

          {/* MercadoPago — env vars only, não editável via UI */}
          <div className="card">
            <div className="mb-5 flex items-center gap-3">
              <span className="icon-halo"><CreditCard size={18} /></span>
              <div>
                <h2 className="text-title-md font-bold">Integração Mercado Pago</h2>
                <p className="text-label-sm text-on-surface-variant">Chaves configuradas via variáveis de ambiente.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-blue-800">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <div className="text-label-sm space-y-1">
                <p className="font-semibold">Chaves gerenciadas via .env / Vercel</p>
                <p>Para segurança, <code className="font-mono">MP_ACCESS_TOKEN</code> e <code className="font-mono">MP_WEBHOOK_SECRET</code> são configurados diretamente no painel do Vercel → Settings → Environment Variables.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-label-sm">
              <div className="rounded-xl border border-outline-variant p-3">
                <span className="font-semibold">MP_ACCESS_TOKEN</span>
                <p className="mt-1 font-mono text-on-surface-variant">
                  {process.env.NEXT_PUBLIC_MP_TOKEN_SET === 'true' ? '✅ Configurado' : '⚠️ Não detectado (var server-side)'}
                </p>
              </div>
              <div className="rounded-xl border border-outline-variant p-3">
                <span className="font-semibold">MP_WEBHOOK_SECRET</span>
                <p className="mt-1 font-mono text-on-surface-variant">Verificar no Vercel</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <div className="mb-5 flex items-center gap-3">
              <span className="icon-halo"><Percent size={18} /></span>
              <div>
                <h2 className="text-title-md font-bold">Valores e Comissões</h2>
                <p className="text-label-sm text-on-surface-variant">Preço do site e comissão padrão para novos afiliados.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Preço do Site (R$)</label>
                <input
                  type="number"
                  value={sitePrice}
                  onChange={(e) => setSitePrice(e.target.value)}
                  className="field"
                  min="1"
                  step="1"
                  disabled={loading}
                />
                <p className="mt-1 text-label-sm text-on-surface-variant">Valor cobrado do cliente no checkout.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Comissão Padrão (R$)</label>
                <input
                  type="number"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="field"
                  min="1"
                  step="1"
                  disabled={loading}
                />
                <p className="mt-1 text-label-sm text-on-surface-variant">Comissão fixa aplicada a novos revendedores.</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave('pricing', { site_price: sitePrice, commission_default: commission })}
                className="btn-primary"
                disabled={loading || saving === 'pricing'}
              >
                {saving === 'pricing' ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Salvar Valores
              </button>
              {saved === 'pricing' && (
                <span className="flex items-center gap-1 text-label-sm text-green-600">
                  <CheckCircle2 size={14} /> Salvo!
                </span>
              )}
            </div>
          </div>

          {/* Legal */}
          <div className="card">
            <div className="mb-5 flex items-center gap-3">
              <span className="icon-halo"><FileText size={18} /></span>
              <div>
                <h2 className="text-title-md font-bold">Documentos Legais</h2>
                <p className="text-label-sm text-on-surface-variant">Termos de uso editáveis diretamente no código.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-yellow-50 p-4 text-yellow-800">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <div className="text-label-sm">
                <p className="font-semibold">Edite o arquivo diretamente</p>
                <p className="mt-1">Os termos estão em <code className="font-mono">app/termos/page.tsx</code>. Edite e faça deploy para atualizar. Última atualização: maio de 2026.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
