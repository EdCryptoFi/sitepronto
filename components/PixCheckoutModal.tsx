'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Copy, Check, Loader2, QrCode, Clock, ShieldCheck,
  AlertCircle, CreditCard,
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface PixCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onPayWithCard?: () => void;
  briefingId: string;
  businessName: string;
  payerEmail: string;
}

type PixStep = 'form' | 'qrcode' | 'approved';

interface PixData {
  paymentId: number;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  pixPrice: number;
  originalPrice: number;
  discount: number;
  expiresAt: string;
}

export default function PixCheckoutModal({
  open, onClose, onPayWithCard, briefingId, businessName, payerEmail,
}: PixCheckoutModalProps) {
  const [step, setStep] = useState<PixStep>('form');
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format CPF as user types: 000.000.000-00
  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const rawCpf = cpf.replace(/\D/g, '');
  const canSubmit = rawCpf.length === 11 && name.trim().length >= 2;

  // Countdown timer
  useEffect(() => {
    if (!pixData?.expiresAt) return;
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((new Date(pixData.expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setError('QR Code expirado. Gere um novo.');
        setStep('form');
        setPixData(null);
      }
    };
    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [pixData?.expiresAt]);

  // Poll payment status
  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  useEffect(() => {
    if (step !== 'qrcode' || !briefingId) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/payment-status/${briefingId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'approved') {
          stopPolling();
          analytics.purchase(briefingId, pixData?.pixPrice ?? 225, 'pix');
          setStep('approved');
          // Redirect after brief celebration
          setTimeout(() => {
            window.location.href = `/success?payment_id=${pixData?.paymentId ?? ''}&external_reference=${briefingId}`;
          }, 2500);
        } else if (data.status === 'rejected') {
          stopPolling();
          setError('Pagamento rejeitado. Tente novamente.');
          setStep('form');
          setPixData(null);
        }
      } catch { /* silencioso */ }
    };
    poll(); // immediate first check
    pollRef.current = setInterval(poll, 5000);
    return stopPolling;
  }, [step, briefingId, pixData?.paymentId, stopPolling]);

  // Cleanup on unmount
  useEffect(() => () => { stopPolling(); if (timerRef.current) clearInterval(timerRef.current); }, [stopPolling]);

  const handleCreatePix = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefingId,
          payerEmail,
          payerName: name.trim(),
          payerCpf: rawCpf,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Erro ao gerar Pix.');
        setLoading(false);
        return;
      }
      setPixData({
        paymentId: data.paymentId,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        ticketUrl: data.ticketUrl,
        pixPrice: data.pixPrice,
        originalPrice: data.originalPrice,
        discount: data.discount,
        expiresAt: data.expiresAt,
      });
      analytics.pixQrGenerated(data.pixPrice);
      setStep('qrcode');
    } catch {
      setError('Falha de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!pixData?.qrCode) return;
    navigator.clipboard.writeText(pixData.qrCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#1a1d27] shadow-2xl ring-1 ring-white/10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#1a1d27] px-6 pt-5 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-primary" />
            <h3 className="text-base font-bold text-white">
              {step === 'approved' ? 'Pagamento confirmado!' : 'Pagar com Pix'}
            </h3>
          </div>
          {step !== 'approved' && (
            <button type="button" onClick={onClose} className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* STEP 1: CPF Form */}
          {step === 'form' && (
            <div className="mt-4 space-y-5">
              {/* Pricing */}
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/50">Site profissional</span>
                  <span className="text-sm text-white/40 line-through">R$ 300</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{businessName}</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-green-400">R$ 225</span>
                    <span className="ml-1.5 rounded-full bg-green-900/30 px-2 py-0.5 text-[10px] font-bold text-green-400">
                      -25% Pix
                    </span>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="pix-name" className="mb-1.5 block text-xs font-semibold text-white/60">
                  Nome completo
                </label>
                <input
                  id="pix-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
                  placeholder="Seu nome completo"
                  maxLength={120}
                  autoFocus
                />
              </div>

              {/* CPF */}
              <div>
                <label htmlFor="pix-cpf" className="mb-1.5 block text-xs font-semibold text-white/60">
                  CPF <span className="font-normal text-white/30">(obrigatorio para Pix)</span>
                </label>
                <input
                  id="pix-cpf"
                  type="text"
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 font-mono tracking-wider"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-900/20 px-4 py-3 text-sm text-red-300">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleCreatePix}
                disabled={!canSubmit || loading}
                className="w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: canSubmit ? '#16a34a' : '#374151' }}
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Gerando QR Code...</span>
                  : <span className="flex items-center justify-center gap-2"><QrCode size={16} /> Gerar QR Code Pix — R$ 225</span>
                }
              </button>

              {/* Pay with card link */}
              {onPayWithCard && (
                <button
                  type="button"
                  onClick={() => { onClose(); onPayWithCard(); }}
                  className="flex w-full items-center justify-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  <CreditCard size={12} /> Prefiro pagar com cartao (sem desconto)
                </button>
              )}

              <p className="text-center text-[10px] text-white/25 flex items-center justify-center gap-1">
                <ShieldCheck size={10} /> Pagamento seguro via Mercado Pago
              </p>
            </div>
          )}

          {/* STEP 2: QR Code Display */}
          {step === 'qrcode' && pixData && (
            <div className="mt-4 space-y-4">
              {/* Timer */}
              <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-900/20 px-4 py-2.5 text-sm">
                <Clock size={14} className="text-amber-400" />
                <span className="font-medium text-amber-300">
                  Expira em {formatTime(timeLeft)}
                </span>
              </div>

              {/* QR Code image */}
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6">
                {pixData.qrCodeBase64 ? (
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="h-52 w-52"
                  />
                ) : (
                  <div className="flex h-52 w-52 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                    <QrCode size={64} />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-600">Escaneie com seu app do banco</p>
                  <p className="mt-1 text-2xl font-extrabold text-gray-900">
                    R$ {pixData.pixPrice.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-[11px] text-gray-400 line-through">
                    R$ {pixData.originalPrice.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* Copy code */}
              <div>
                <p className="mb-2 text-xs font-semibold text-white/50 text-center">Ou copie o codigo Pix:</p>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs text-white/60 font-mono">{pixData.qrCode}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                      {copied
                        ? <><Check size={14} className="text-green-400" /> Copiado!</>
                        : <><Copy size={14} /> Copiar</>
                      }
                    </span>
                  </div>
                </button>
              </div>

              {/* Polling indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                <Loader2 size={12} className="animate-spin text-primary" />
                Aguardando confirmacao do pagamento...
              </div>

              {/* Instructions */}
              <div className="rounded-2xl bg-white/5 p-4 space-y-2">
                <p className="text-xs font-semibold text-white/60 mb-3">Como pagar:</p>
                {[
                  'Abra o app do seu banco ou carteira digital',
                  'Escolha pagar com Pix (QR Code ou copia-e-cola)',
                  'Escaneie o QR Code ou cole o codigo',
                  'Confirme o pagamento',
                ].map((txt, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs text-white/70">{txt}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-900/20 px-4 py-3 text-sm text-red-300">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Approved */}
          {step === 'approved' && (
            <div className="mt-6 flex flex-col items-center gap-4 py-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-900/30">
                <Check size={36} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Pagamento aprovado!</h3>
              <p className="text-sm text-white/60 text-center">
                Seu site <strong className="text-white">{businessName}</strong> sera publicado em instantes.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Loader2 size={12} className="animate-spin" /> Redirecionando...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
