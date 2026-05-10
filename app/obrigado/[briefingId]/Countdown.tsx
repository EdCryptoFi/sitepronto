'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function Countdown({ targetIso }: { targetIso: string }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(targetIso).getTime() - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetIso).getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  const hours = Math.floor(timeLeft / 3_600_000);
  const minutes = Math.floor((timeLeft % 3_600_000) / 60_000);
  const seconds = Math.floor((timeLeft % 60_000) / 1000);

  if (timeLeft === 0) {
    return (
      <div className="flex items-center gap-2 text-label-md font-semibold text-primary">
        <Clock size={16} />
        Seu site está pronto — aguarde o contato!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Clock size={16} className="shrink-0 text-on-surface-variant" />
      <span className="text-label-md text-on-surface-variant">Entrega em</span>
      <div className="flex items-center gap-1 font-mono text-title-lg font-bold tabular-nums">
        <span className="rounded-xl bg-surface-med px-3 py-1">{pad(hours)}</span>
        <span className="text-on-surface-variant">:</span>
        <span className="rounded-xl bg-surface-med px-3 py-1">{pad(minutes)}</span>
        <span className="text-on-surface-variant">:</span>
        <span className="rounded-xl bg-surface-med px-3 py-1">{pad(seconds)}</span>
      </div>
    </div>
  );
}
