import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Users, Wallet, Clock, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

async function getAfiliados() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('resellers')
    .select('id, name, email, whatsapp, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return data ?? [];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default async function AfiliadosPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_SESSION_TOKEN) redirect('/admin/login');

  const afiliados = await getAfiliados();

  const total = afiliados.length;
  const pendingPayout = afiliados.filter((a) => (a as Record<string, string>).status === 'payout_pending').length;
  const totalBalance = pendingPayout * 50;

  return (
    <div className="min-h-screen bg-surface lg:pl-64">
      <AdminSidebar />

      <div className="pb-20 pt-6 lg:pb-6">
        <div className="px-6">
          <h1 className="text-headline-sm font-bold">Afiliados</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">Programa de revendedores</p>
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid gap-4 px-6 sm:grid-cols-3">
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Total de Afiliados</span>
              <span className="icon-halo !h-8 !w-8"><Users size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold">{total}</div>
            <div className="mt-1 text-label-sm text-on-surface-variant">cadastros ativos</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Saldo a Pagar</span>
              <span className="icon-halo !h-8 !w-8"><Wallet size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold text-primary">
              R$ {(totalBalance).toFixed(2).replace('.', ',')}
            </div>
            <div className="mt-1 text-label-sm text-on-surface-variant">aguarda aprovação</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">Saques Pendentes</span>
              <span className="icon-halo !h-8 !w-8"><Clock size={16} /></span>
            </div>
            <div className="mt-4 text-display-sm font-extrabold">{pendingPayout}</div>
            <div className="mt-1 text-label-sm text-on-surface-variant">requisições aguardando</div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 px-6">
          <div className="overflow-hidden rounded-3xl bg-surface-low shadow-architectural">
            <div className="border-b border-[color:var(--outline-variant)] px-5 py-4">
              <h2 className="text-title-md font-bold">Gestão de Revendedores</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-[color:var(--outline-variant)] text-label-sm text-on-surface-variant">
                    <th className="px-5 py-3 font-semibold">Afiliado</th>
                    <th className="px-5 py-3 font-semibold">WhatsApp</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Cadastro</th>
                    <th className="px-5 py-3 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {afiliados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant italic">
                        Nenhum afiliado cadastrado ainda.
                      </td>
                    </tr>
                  ) : (
                    afiliados.map((a, i) => {
                      const af = a as Record<string, string>;
                      const isPending = af.status === 'payout_pending';
                      return (
                        <tr
                          key={af.id}
                          className={`border-b border-[color:var(--outline-variant)] last:border-0 ${i % 2 !== 0 ? 'bg-surface' : ''}`}
                        >
                          <td className="px-5 py-3">
                            <div className="font-semibold">{af.name}</div>
                            <div className="text-label-sm text-on-surface-variant">{af.email}</div>
                          </td>
                          <td className="px-5 py-3 text-on-surface-variant">{af.whatsapp || '—'}</td>
                          <td className="px-5 py-3">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-label-sm font-semibold text-yellow-700">
                                <Clock size={11} /> Saque Pendente
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-surface-med px-2 py-0.5 text-label-sm font-semibold text-on-surface-variant">
                                <CheckCircle2 size={11} /> Ativo
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-on-surface-variant">{formatDate(af.created_at)}</td>
                          <td className="px-5 py-3">
                            {isPending ? (
                              <button
                                type="button"
                                className="rounded-xl px-3 py-1.5 text-label-sm font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: '#b54e00' }}
                              >
                                Aprovar Pagamento
                              </button>
                            ) : (
                              <span className="text-label-sm text-on-surface-variant italic">Sem solicitação</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
