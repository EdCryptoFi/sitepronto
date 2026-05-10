'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, LayoutDashboard, TrendingUp, Users, Share2, Settings, LogOut,
} from 'lucide-react';

const NAV = [
  { href: '/admin/briefings', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/vendas', label: 'Vendas', icon: TrendingUp },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/afiliados', label: 'Afiliados', icon: Share2 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r border-[color:var(--outline-variant)] bg-surface-low lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-[color:var(--outline-variant)] px-5 py-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
            <Sparkles size={15} />
          </span>
          <div>
            <span className="text-title-md font-bold tracking-tight">
              SitePronto<span className="text-primary">.</span>
            </span>
            <p className="text-[10px] text-on-surface-variant">Admin Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin/briefings' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md font-semibold transition-colors ${
                  active
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-med hover:text-on-surface'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[color:var(--outline-variant)] p-3">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-med hover:text-on-surface"
            >
              <LogOut size={18} /> Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[color:var(--outline-variant)] bg-surface-low lg:hidden">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin/briefings' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-center transition-colors ${
                active ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
