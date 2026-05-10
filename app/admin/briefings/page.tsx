import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, PenLine, AlertCircle, CheckCircle2, Clock, XCircle, Download, Eye } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const MOCK_BRIEFINGS = [
  {
    id: 'mock-001',
    segment: 'restaurante',
    goal: 'whatsapp',
    template: 'restaurant',
    palette: 'vinho-premium',
    payment_status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    domain: 'pizzariadomario.com.br',
  },
  {
    id: 'mock-002',
    segment: 'loja',
    goal: 'vender',
    template: 'store',
    palette: 'azul-editorial',
    payment_status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    domain: 'lojamodaexpress.com.br',
  },
  {
    id: 'mock-003',
    segment: 'clinica',
    goal: 'agendar',
    template: 'farmacy',
    palette: 'verde-servico',
    payment_status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    domain: '',
  },
];

async function getBriefings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { data: MOCK_BRIEFINGS, mock: true };

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('briefings')
    .select('id, segment, goal, template, palette, payment_status, created_at, domain')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return { data: MOCK_BRIEFINGS, mock: true };
  return { data: data ?? [], mock: false };
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-label-sm font-semibold text-green-700">
        <CheckCircle2 size={11} /> Pago
      </span>
    );
  if (status === 'rejected')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-label-sm font-semibold text-red-700">
        <XCircle size={11} /> Rejeitado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-label-sm font-semibold text-yellow-700">
      <Clock size={11} /> Pendente
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function AdminBriefingsPage() {
  const { data: briefings, mock } = await getBriefings();

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pl-64">
      <AdminSidebar />
      {/* Header */}
      <div className="border-b border-[color:var(--outline-variant)] bg-surface-low px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
              <Sparkles size={15} />
            </span>
            <span className="text-title-md font-bold tracking-tight">
              SitePronto<span className="text-primary">.</span>{' '}
              <span className="font-normal text-on-surface-variant">Admin</span>
            </span>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="btn-ghost text-label-sm">Sair</button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        {mock && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-yellow-50 p-4 text-yellow-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-label-md font-semibold">Supabase não configurado</p>
              <p className="text-label-sm">
                Exibindo dados fictícios. Configure{' '}
                <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
                <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no .env.local para ver dados reais.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-headline-sm font-bold">Briefings</h1>
          <span className="text-label-sm text-on-surface-variant">{briefings.length} registros</span>
        </div>

        <div className="overflow-hidden rounded-3xl bg-surface-low shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="border-b border-[color:var(--outline-variant)] text-label-sm text-on-surface-variant">
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Segmento</th>
                <th className="px-5 py-3 font-semibold">Template</th>
                <th className="px-5 py-3 font-semibold">Domínio</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Data</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {briefings.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-[color:var(--outline-variant)] last:border-0 ${
                    i % 2 === 0 ? '' : 'bg-surface'
                  }`}
                >
                  <td className="px-5 py-3 font-mono text-[11px] text-on-surface-variant">
                    {b.id.slice(0, 8)}…
                  </td>
                  <td className="px-5 py-3 capitalize">{b.segment}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-label-sm font-semibold text-primary">
                      {b.template || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">
                    {b.domain || <span className="italic opacity-50">não informado</span>}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.payment_status} />
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{formatDate(b.created_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/preview/${b.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-surface-med px-3 py-1.5 text-label-sm font-semibold text-on-surface transition hover:bg-surface-high"
                        title="Ver preview do site"
                      >
                        <Eye size={13} /> Preview
                      </Link>
                      <Link
                        href={`/admin/editor/${b.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-label-sm font-semibold text-on-primary transition hover:opacity-90"
                      >
                        <PenLine size={13} /> Editar
                      </Link>
                      <a
                        href={`/api/admin/generate-site/${b.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-surface-med px-3 py-1.5 text-label-sm font-semibold text-on-surface transition hover:bg-surface-high"
                        title="Baixar ZIP pronto para FTP"
                      >
                        <Download size={13} /> ZIP
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
