'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Users, TrendingUp, Copy, Check, Plus, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';

type Reseller = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  code: string;
  commission_value: number;
  is_active: boolean;
  created_at: string;
  sales_count?: number;
  total_commission?: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-surface-med px-2.5 py-1 text-label-sm font-semibold text-on-surface transition hover:bg-surface-high"
      title="Copiar link"
    >
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
      {copied ? 'Copiado!' : 'Copiar link'}
    </button>
  );
}

export default function AfiliadosPage() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });
  const [creating, setCreating] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sitepronto.com.br';

  async function loadResellers() {
    const res = await fetch('/api/admin/resellers-list');
    if (res.ok) setResellers(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadResellers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/admin/resellers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.ok) {
      setNewCode(json.code);
      setForm({ name: '', email: '', whatsapp: '' });
      await loadResellers();
    }
    setCreating(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch('/api/admin/resellers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !current }),
    });
    setResellers((prev) => prev.map((r) => r.id === id ? { ...r, is_active: !current } : r));
  }

  const totalSales = resellers.reduce((s, r) => s + (r.sales_count ?? 0), 0);
  const totalCommission = resellers.reduce((s, r) => s + (r.total_commission ?? 0), 0);

  return (
    <div className="min-h-screen bg-surface lg:pl-64">
      <AdminSidebar />

      <div className="pb-20 pt-6">
        <div className="flex items-center justify-between px-6">
          <div>
            <h1 className="text-headline-sm font-bold">Revendedores</h1>
            <p className="mt-1 text-body-sm text-on-surface-variant">Gerencie links de afiliado e acompanhe comissões</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setNewCode(null); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Novo revendedor
          </button>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid gap-4 px-6 sm:grid-cols-3">
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Revendedores</span>
              <span className="icon-halo !h-8 !w-8"><Users size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold">{resellers.length}</div>
            <div className="mt-1 text-label-sm text-on-surface-variant">{resellers.filter(r => r.is_active).length} ativos</div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Vendas via Afiliado</span>
              <span className="icon-halo !h-8 !w-8"><TrendingUp size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold">{totalSales}</div>
            <div className="mt-1 text-label-sm text-on-surface-variant">pedidos confirmados</div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Comissões Geradas</span>
              <span className="icon-halo !h-8 !w-8"><span className="text-xs font-bold">R$</span></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold text-primary">
              {totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="mt-1 text-label-sm text-on-surface-variant">total acumulado</div>
          </div>
        </div>

        {/* New reseller form */}
        {showForm && (
          <div className="mt-6 px-6">
            <div className="rounded-3xl border border-outline-variant bg-surface-low p-6">
              <h2 className="mb-4 text-title-md font-bold">Cadastrar novo revendedor</h2>
              {newCode && (
                <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-label-sm font-semibold text-green-700">✅ Revendedor criado! Código gerado:</p>
                  <div className="mt-2 flex items-center gap-3">
                    <code className="rounded-lg bg-white px-3 py-2 text-label-md font-bold text-green-800">{newCode}</code>
                    <CopyButton text={`${baseUrl}/?ref=${newCode}`} />
                    <a href={`/painel/${newCode}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-label-sm font-semibold text-primary hover:underline">
                      <ExternalLink size={12} /> Ver painel
                    </a>
                  </div>
                  <p className="mt-2 text-label-sm text-green-600">Link: {baseUrl}/?ref={newCode}</p>
                </div>
              )}
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-label-sm font-semibold">Nome *</label>
                  <input
                    required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input w-full" placeholder="Nome do revendedor"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-label-sm font-semibold">E-mail *</label>
                  <input
                    required type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input w-full" placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-label-sm font-semibold">WhatsApp</label>
                  <input
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="input w-full" placeholder="(19) 99999-9999"
                  />
                </div>
                <div className="sm:col-span-3">
                  <button type="submit" disabled={creating} className="btn-primary">
                    {creating ? 'Criando…' : 'Criar revendedor e gerar código'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="mt-6 px-6">
          <div className="overflow-hidden rounded-3xl bg-surface-low shadow-architectural">
            <div className="border-b border-[color:var(--outline-variant)] px-5 py-4">
              <h2 className="text-title-md font-bold">Todos os revendedores</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">Carregando…</div>
            ) : resellers.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant italic">Nenhum revendedor cadastrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-body-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--outline-variant)] text-label-sm text-on-surface-variant">
                      <th className="px-5 py-3 font-semibold">Revendedor</th>
                      <th className="px-5 py-3 font-semibold">Código</th>
                      <th className="px-5 py-3 font-semibold">Vendas</th>
                      <th className="px-5 py-3 font-semibold">Comissão</th>
                      <th className="px-5 py-3 font-semibold">Link</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resellers.map((r, i) => (
                      <tr key={r.id} className={`border-b border-[color:var(--outline-variant)] last:border-0 ${i % 2 !== 0 ? 'bg-surface' : ''}`}>
                        <td className="px-5 py-3">
                          <div className="font-semibold">{r.name}</div>
                          <div className="text-label-sm text-on-surface-variant">{r.email}</div>
                          {r.whatsapp && <div className="text-label-sm text-on-surface-variant">{r.whatsapp}</div>}
                        </td>
                        <td className="px-5 py-3">
                          <code className="rounded-lg bg-primary/10 px-2.5 py-1 text-label-sm font-bold text-primary">{r.code}</code>
                        </td>
                        <td className="px-5 py-3 text-center font-bold">{r.sales_count ?? 0}</td>
                        <td className="px-5 py-3 font-bold text-green-600">
                          {((r.sales_count ?? 0) * r.commission_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <CopyButton text={`${baseUrl}/?ref=${r.code}`} />
                            <a href={`/painel/${r.code}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-surface-med px-2.5 py-1 text-label-sm font-semibold hover:bg-surface-high">
                              <ExternalLink size={12} /> Painel
                            </a>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => toggleActive(r.id, r.is_active)} className="inline-flex items-center gap-1.5 text-label-sm font-semibold">
                            {r.is_active
                              ? <><ToggleRight size={18} className="text-green-600" /> Ativo</>
                              : <><ToggleLeft size={18} className="text-on-surface-variant" /> Inativo</>}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-on-surface-variant">{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
