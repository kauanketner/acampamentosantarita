'use client';

import { cn } from '@/lib/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type Item = { href: string; label: string };

export function MobileMenu({ items, appUrl }: { items: Item[]; appUrl: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        className="lg:hidden inline-flex items-center justify-center size-10 -mr-2 rounded-full text-(color:--color-ink) hover:bg-(color:--color-ink)/5"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          {open ? (
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7H20M4 12H20M4 17H14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-(color:--color-ink)/40 backdrop-blur-sm animate-drift-fade"
          />
          <div
            className={cn(
              'absolute right-0 top-0 bottom-0 w-full max-w-sm',
              'bg-(color:--color-paper) border-l border-(color:--color-rule)',
              'flex flex-col animate-drift-up',
            )}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-(color:--color-rule)">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="size-9 inline-flex items-center justify-center rounded-full hover:bg-(color:--color-ink)/5"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6">
              <ul className="space-y-1">
                <li>
                  <NavLink href="/" label="Início" pathname={pathname} />
                </li>
                {items.map((item) => (
                  <li key={item.href}>
                    <NavLink href={item.href} label={item.label} pathname={pathname} />
                  </li>
                ))}
              </ul>

              <div className="mt-10 ornament">
                <span className="text-(color:--color-accent-deep)">❀</span>
              </div>

              <a
                href={appUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center justify-between rounded-(--radius-md) bg-(color:--color-oxblood) text-(color:--color-paper) px-5 py-4"
              >
                <span>
                  <span className="eyebrow text-(color:--color-paper)/70 block mb-0.5">
                    Comunidade
                  </span>
                  <span className="font-display italic text-lg leading-none">Acessar o app</span>
                </span>
                <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
                  <path
                    d="M3 9L9 3M9 3H4M9 3V8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </nav>

            <div className="px-6 py-5 border-t border-(color:--color-rule) text-[11px] text-(color:--color-ink-faint) leading-relaxed">
              <p>contato@acampamentosantarita.com.br</p>
              <p className="mt-1">© {new Date().getFullYear()} · Comunidade Santa Rita</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-baseline justify-between py-3 border-b border-(color:--color-rule)/60 last:border-0',
        active && 'text-(color:--color-oxblood)',
      )}
    >
      <span
        className={cn(
          'font-display text-2xl tracking-tight',
          active ? 'italic' : 'group-hover:italic',
        )}
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
      >
        {label}
      </span>
      <svg
        viewBox="0 0 12 12"
        className="size-3 text-(color:--color-ink-faint) group-hover:text-(color:--color-oxblood) transition-colors"
        fill="none"
        aria-hidden
      >
        <path
          d="M3 9L9 3M9 3H4M9 3V8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
