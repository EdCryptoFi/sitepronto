import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

async function getVendasData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('briefings')
    .select('id, domain, payment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return data ?? [];
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved')
    return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-label-sm font-semibold text-green-700">Pago</span>;
  if (status === 'rejected')
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-label-sm font-semibold text-red-700">Recusado</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-label-sm font-semibold text-yellow-700">Pendente</span>;
}

export default async function VendasPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_SESSION_TOKEN) redirect('/admin/login');

  const briefings = await getVendasData();

  const approved = briefings?.filter((b) => b.payment_status === 'approved') ?? [];
  const grossRevenue = approved.length * 300;
  const fees = Math.round(grossRevenue * 0.0499 * 100) / 100;
  const netRevenue = grossRevenue - fees;

  // Simple bar chart: last 30 days by week
  const now = Date.now();
  const days30 = approved.filter((b) => now - new Date(b.created_at).getTime() < 30 * 24 * 3600 * 1000);
  const weeks = Array.from({ length: 4 }, (_, w) => ({
    label: `S${4 - w}`,
    count: days30.filter((b) => {
      const age = (now - new Date(b.created_at).getTime()) / (24 * 3600 * 1000);
      return age >= w * 7 && age < (w + 1) * 7;
    }).length,
  })).reverse();
  const maxCount = Math.max(...weeks.map((w) => w.count), 1);

  return (
    <div className="min-h-screen bg-surface lg:pl-64">
      <AdminSidebar />

      <div className="pb-20 pt-6 lg:pb-6">
        <div className="px-6">
          <h1 className="text-headline-sm font-bold">Vendas</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">Métricas e transações da plataforma</p>
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid gap-4 px-6 sm:grid-cols-3">
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Faturamento Bruto</span>
              <span className="icon-halo !h-8 !w-8"><DollarSign size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold">{formatCurrency(grossRevenue)}</div>
            <div className="mt-1 flex items-center gap-1 text-label-sm text-green-600">
              <TrendingUp size={13} /> {approved.length} vendas confirmadas
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Taxas (≈4,99%)</span>
              <span className="icon-halo !h-8 !w-8"><Receipt size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold">{formatCurrency(fees)}</div>
            <div className="mt-1 flex items-center gap-1 text-label-sm text-on-surface-variant">
              <TrendingDown size={13} /> Mercado Pago
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Faturamento Líquido</span>
              <span className="icon-halo !h-8 !w-8"><TrendingUp size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold text-primary">{formatCurrency(netRevenue)}</div>
            <div className="mt-1 text-label-sm text-on-surface-variant">
              Meta: {Math.round((netRevenue / Math.max(grossRevenue, 1)) * 100)}% do bruto
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="mt-6 px-6">
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-title-md font-bold">Evolução de Vendas</h2>
                <p className="text-label-sm text-on-surface-variant">Últimas 4 semanas</p>
              </div>
            </div>
            <div className="flex h-32 items-end gap-3">
              {weeks.map((w) => (
                <div key={w.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-label-sm font-semibold text-on-surface-variant">{w.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-primary transition-all"
                    style={{ height: `${Math.max((w.count / maxCount) * 100, 4)}%` }}
                  />
                  <span className="text-label-sm text-on-surface-variant">{w.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="mt-6 px-6">
          <div className="overflow-hidden rounded-3xl bg-surface-low shadow-architectural">
            <div className="border-b border-[color:var(--outline-variant)] px-5 py-4">
              <h2 className="text-title-md font-bold">Transações Recentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-[color:var(--outline-variant)] text-label-sm text-on-surface-variant">
                    <th className="px-5 py-3 font-semibold">ID</th>
                    <th className="px-5 py-3 font-semibold">Domínio / Cliente</th>
                    <th className="px-5 py-3 font-semibold">Data</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {(briefings ?? []).slice(0, 20).map((b, i) => (
                    <tr key={b.id} className={`border-b border-[color:var(--outline-variant)] last:border-0 ${i % 2 !== 0 ? 'bg-surface' : ''}`}>
                      <td className="px-5 py-3 font-mono text-[11px] text-on-surface-variant">{b.id.slice(0, 8)}…</td>
                      <td className="px-5 py-3">{b.domain || <span className="italic opacity-50">sem domínio</span>}</td>
                      <td className="px-5 py-3 text-on-surface-variant">{formatDate(b.created_at)}</td>
                      <td className="px-5 py-3"><StatusBadge status={b.payment_status} /></td>
                      <td className="px-5 py-3 font-semibold">
                        {b.payment_status === 'approved' ? formatCurrency(300) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
