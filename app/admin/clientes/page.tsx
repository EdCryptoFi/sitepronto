import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye, PenLine, Download, CheckCircle2, Clock, XCircle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

async function getClientes(status?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  let q = supabase
    .from('briefings')
    .select('id, segment, template, domain, payment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(60);

  if (status && status !== 'todos') q = q.eq('payment_status', status);

  const { data } = await q;
  return data ?? [];
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
        <XCircle size={11} /> Recusado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-label-sm font-semibold text-yellow-700">
      <Clock size={11} /> Pendente
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_SESSION_TOKEN) redirect('/admin/login');

  const { status } = await searchParams;
  const clientes = await getClientes(status);

  const STATUS_FILTERS = [
    { value: 'todos', label: 'Todos' },
    { value: 'approved', label: 'Pagos' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'rejected', label: 'Recusados' },
  ];

  return (
    <div className="min-h-screen bg-surface lg:pl-64">
      <AdminSidebar />

      <div className="pb-20 pt-6 lg:pb-6">
        <div className="px-6">
          <h1 className="text-headline-sm font-bold">Gestão de Clientes</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {clientes.length} registros encontrados
          </p>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2 px-6">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === 'todos' ? '/admin/clientes' : `/admin/clientes?status=${f.value}`}
              className={`rounded-xl px-4 py-2 text-label-md font-semibold transition-colors ${
                (f.value === 'todos' && !status) || status === f.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-low text-on-surface-variant hover:bg-surface-med'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="mt-6 px-6">
          <div className="overflow-hidden rounded-3xl bg-surface-low shadow-architectural">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-[color:var(--outline-variant)] text-label-sm text-on-surface-variant">
                    <th className="px-5 py-3 font-semibold">ID</th>
                    <th className="px-5 py-3 font-semibold">Segmento</th>
                    <th className="px-5 py-3 font-semibold">Domínio</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Data</th>
                    <th className="px-5 py-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-[color:var(--outline-variant)] last:border-0 ${i % 2 !== 0 ? 'bg-surface' : ''}`}
                    >
                      <td className="px-5 py-3 font-mono text-[11px] text-on-surface-variant">
                        {c.id.slice(0, 8)}…
                      </td>
                      <td className="px-5 py-3 capitalize">{c.segment}</td>
                      <td className="px-5 py-3 text-on-surface-variant">
                        {c.domain || <span className="italic opacity-50">não informado</span>}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={c.payment_status} />
                      </td>
                      <td className="px-5 py-3 text-on-surface-variant">{formatDate(c.created_at)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/preview/${c.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-surface-med px-2.5 py-1.5 text-label-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
                          >
                            <Eye size={12} /> Ver
                          </Link>
                          <Link
                            href={`/admin/editor/${c.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-primary px-2.5 py-1.5 text-label-sm font-semibold text-on-primary hover:opacity-90 transition-opacity"
                          >
                            <PenLine size={12} /> Editar
                          </Link>
                          <a
                            href={`/api/admin/generate-site/${c.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-surface-med px-2.5 py-1.5 text-label-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
                          >
                            <Download size={12} /> ZIP
                          </a>
                        </div>
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
