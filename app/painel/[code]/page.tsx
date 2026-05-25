import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import WithdrawForm from './WithdrawForm';

const SEGMENT_LABELS: Record<string, string> = {
  restaurante: 'Restaurante', loja: 'Loja', clinica: 'Clínica',
  servicos: 'Serviços', educacao: 'Portfólio', veterinaria: 'Veterinária',
  petshop: 'Pet Shop', academia: 'Academia', imobiliaria: 'Imobiliária',
  contabilidade: 'Contabilidade', tecnologia: 'Tecnologia', farmacia: 'Farmácia',
  turismo: 'Turismo', transporte: 'Transporte', fotografia: 'Fotografia',
  outro: 'Negócio',
};

async function getData(code: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);

  const [{ data: reseller }, { data: briefings }, { data: withdrawals }] = await Promise.all([
    supabase
      .from('resellers')
      .select('id, name, email, code, commission_value, is_active, created_at')
      .eq('code', code)
      .single(),
    supabase
      .from('briefings')
      .select('id, segment, domain, payment_status, deployed_at, created_at')
      .eq('referral_code', code)
      .order('created_at', { ascending: false }),
    supabase
      .from('reseller_withdrawals')
      .select('id, amount, pix_key, status, created_at')
      .eq('reseller_id', (await supabase.from('resellers').select('id').eq('code', code).single()).data?.id ?? '')
      .order('created_at', { ascending: false }),
  ]);

  if (!reseller || !reseller.is_active) return null;
  return { reseller, briefings: briefings ?? [], withdrawals: withdrawals ?? [] };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default async function ResellerPanel({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getData(code.toUpperCase());
  if (!data) notFound();

  const { reseller, briefings, withdrawals } = data;
  const commission = reseller.commission_value ?? 50;

  // Only count deployed briefings for available balance
  const deployed = briefings.filter((b) => b.deployed_at);
  const paid = briefings.filter((b) => b.payment_status === 'approved');
  const pending = briefings.filter((b) => b.payment_status === 'pending');

  const totalEarned = deployed.length * commission;
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === 'approved')
    .reduce((s, w) => s + w.amount, 0);
  const pendingWithdrawal = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((s, w) => s + w.amount, 0);
  const availableBalance = totalEarned - totalWithdrawn - pendingWithdrawal;

  const s = { bg: '#0f172a', card: '#1e293b', border: '#334155', text: '#f1f5f9', muted: '#64748b', primary: '#3b82f6', green: '#4ade80', yellow: '#fbbf24' };

  return (
    <main style={{ background: s.bg, minHeight: '100vh', color: s.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <div style={{ background: s.card, borderBottom: `1px solid ${s.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>SitePronto<span style={{ color: s.primary }}>.</span></span>
          <span style={{ fontSize: 12, color: s.muted, fontWeight: 600, background: s.bg, padding: '2px 10px', borderRadius: 20 }}>Painel do Revendedor</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{reseller.name}</p>
          <p style={{ margin: 0, fontSize: 12, color: s.muted }}>Código: {reseller.code}</p>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px' }}>

        {/* Link */}
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20, marginBottom: 28 }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: s.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>Seu link de divulgação</p>
          <code style={{ display: 'block', fontSize: 14, color: '#93c5fd', background: s.bg, padding: '10px 14px', borderRadius: 8, wordBreak: 'break-all' }}>
            {`https://sitepronto.com.br/?ref=${reseller.code}`}
          </code>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#475569' }}>
            Compartilhe este link. Toda compra feita por ele é automaticamente atribuída a você. A comissão é liberada após a publicação oficial do site no domínio do cliente.
          </p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Saldo disponível', value: `R$ ${availableBalance}`, color: availableBalance > 0 ? '#4ade80' : s.muted, note: 'para saque' },
            { label: 'Total ganho', value: `R$ ${totalEarned}`, color: s.primary, note: `${deployed.length} deploys` },
            { label: 'Vendas pagas', value: paid.length, color: '#a78bfa', note: 'aguardando deploy' },
            { label: 'Aguardando pgto', value: pending.length, color: s.yellow, note: 'cliente pendente' },
          ].map((k) => (
            <div key={k.label} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 14, padding: '18px 16px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: s.muted, fontWeight: 600 }}>{k.label}</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#475569' }}>{k.note}</p>
            </div>
          ))}
        </div>

        {/* Withdraw form */}
        <WithdrawForm
          resellerId={reseller.id}
          availableBalance={availableBalance}
          commission={commission}
        />

        {/* Withdrawals history */}
        {withdrawals.length > 0 && (
          <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Histórico de saques</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${s.border}` }}>
                  {['Data', 'Valor', 'Chave PIX', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 700, color: s.muted, textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} style={{ borderBottom: `1px solid #1e293b22` }}>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8' }}>{formatDate(w.created_at)}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: s.text }}>R$ {w.amount}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8', wordBreak: 'break-all' }}>{w.pix_key}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: w.status === 'approved' ? '#052e16' : w.status === 'rejected' ? '#450a0a' : '#1c1917',
                        color: w.status === 'approved' ? '#4ade80' : w.status === 'rejected' ? '#f87171' : s.yellow,
                      }}>
                        {w.status === 'approved' ? '✅ Aprovado' : w.status === 'rejected' ? '❌ Recusado' : '⏳ Aguardando'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sales list */}
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Histórico de pedidos</h2>
          </div>

          {briefings.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: s.muted }}>
              <p style={{ margin: 0, fontSize: 24 }}>🔗</p>
              <p style={{ margin: '8px 0 0', fontSize: 14 }}>Nenhuma venda ainda. Compartilhe seu link!</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${s.border}` }}>
                  {['Pedido', 'Segmento', 'Domínio', 'Data', 'Pagamento', 'Deploy', 'Comissão'].map((h) => (
                    <th key={h} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 700, color: s.muted, textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {briefings.map((b) => {
                  const isApproved = b.payment_status === 'approved';
                  const isDeployed = !!b.deployed_at;
                  return (
                    <tr key={b.id} style={{ borderBottom: `1px solid #1e293b` }}>
                      <td style={{ padding: '11px 14px', fontSize: 12, fontFamily: 'monospace', color: '#94a3b8' }}>{b.id.slice(0, 8).toUpperCase()}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13 }}>{SEGMENT_LABELS[b.segment ?? ''] ?? '—'}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#94a3b8' }}>{b.domain || '—'}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#94a3b8' }}>{formatDate(b.created_at)}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: isApproved ? '#052e16' : '#1c1917', color: isApproved ? '#4ade80' : s.yellow }}>
                          {isApproved ? '✅ Pago' : '⏳ Pendente'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: isDeployed ? '#052e16' : '#1c1917', color: isDeployed ? '#4ade80' : '#475569' }}>
                          {isDeployed ? `✅ ${formatDate(b.deployed_at!)}` : '⏳ Aguardando'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: isDeployed ? '#4ade80' : '#475569' }}>
                        {isDeployed ? `R$ ${commission}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: '#334155', textAlign: 'center' }}>
          Painel exclusivo do revendedor · SitePronto · Não compartilhe esta URL
        </p>
      </div>
    </main>
  );
}
