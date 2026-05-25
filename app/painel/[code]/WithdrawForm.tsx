'use client';

import { useState } from 'react';

export default function WithdrawForm({
  resellerId,
  availableBalance,
  commission,
}: {
  resellerId: string;
  availableBalance: number;
  commission: number;
}) {
  const [pixKey, setPixKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const canWithdraw = availableBalance >= commission;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canWithdraw || !pixKey.trim() || loading) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/reseller/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resellerId, pixKey: pixKey.trim(), amount: availableBalance }),
    });
    const json = await res.json();

    if (json.ok) {
      setSuccess(true);
      setPixKey('');
    } else {
      setError(json.error ?? 'Erro ao solicitar saque.');
    }
    setLoading(false);
  }

  const s = { card: '#1e293b', border: '#334155', muted: '#64748b', green: '#059669' };

  if (success) {
    return (
      <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 14, padding: 20, marginBottom: 24, textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 22 }}>✅</p>
        <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 700, color: '#4ade80' }}>Solicitação enviada!</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#86efac' }}>Processamos saques em até 3 dias úteis via PIX.</p>
      </div>
    );
  }

  return (
    <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700 }}>Solicitar saque</h2>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: s.muted }}>
        {canWithdraw
          ? `Você tem R$ ${availableBalance} disponíveis para saque (${availableBalance / commission} venda${availableBalance / commission !== 1 ? 's' : ''} deployada${availableBalance / commission !== 1 ? 's' : ''}).`
          : 'Você não tem saldo disponível. A comissão é liberada após a publicação oficial do site no domínio do cliente.'}
      </p>

      {canWithdraw && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: s.muted, marginBottom: 6 }}>
              Chave PIX para recebimento
            </label>
            <input
              required
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              style={{ width: '100%', background: '#0f172a', border: `1px solid ${s.border}`, borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: s.muted, marginBottom: 6 }}>Valor</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#4ade80' }}>R$ {availableBalance}</div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ background: s.green, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Enviando…' : '💸 Solicitar saque'}
          </button>
        </form>
      )}

      {error && <p style={{ margin: '10px 0 0', fontSize: 13, color: '#f87171' }}>{error}</p>}

      <p style={{ margin: '14px 0 0', fontSize: 11, color: '#334155' }}>
        Saques processados em até 3 dias úteis. Valor mínimo: R$ {commission}.
      </p>
    </div>
  );
}
