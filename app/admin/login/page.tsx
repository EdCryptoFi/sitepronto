'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/admin/briefings';

  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace(from);
    } else {
      setError('Senha incorreta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha de administrador"
          autoFocus
          required
          className="w-full rounded-2xl bg-surface-low px-4 py-3 pr-12 text-body-md outline-none ring-1 ring-[color:var(--outline-variant)] focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && (
        <p className="text-label-sm font-semibold text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6">
      <div className="mb-8 flex flex-col items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-on-primary">
          <Sparkles size={22} />
        </span>
        <div className="text-center">
          <h1 className="text-title-lg font-bold tracking-tight">
            SitePronto<span className="text-primary">.</span>{' '}
            <span className="text-on-surface-variant">Admin</span>
          </h1>
          <p className="mt-1 text-label-sm text-on-surface-variant">
            Área restrita — acesso somente para administradores
          </p>
        </div>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
