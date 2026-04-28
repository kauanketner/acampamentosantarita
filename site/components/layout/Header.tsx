'use client';

import { Logomark } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileMenu } from './MobileMenu';

const navItems: Array<{ href: string; label: string }> = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/blog', label: 'Diário' },
  { href: '/lojinha', label: 'Lojinha' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contato', label: 'Contato' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.acampamentosantarita.com.br';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-(color:--color-paper)/85 backdrop-blur-md border-b border-(color:--color-rule)'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Acampamento Santa Rita — início">
          <span className="transition-transform group-hover:rotate-1 group-hover:scale-105 duration-300">
            <Logomark size={48} priority />
          </span>
          <span className="hidden sm:block leading-tight">
            <span className="block font-display text-[14px] lg:text-[15px] tracking-tight text-(color:--color-ink) font-medium"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
              Acampamento Santa Rita
            </span>
            <span className="block eyebrow text-[9px] mt-1">Caieiras · SP · desde 2003</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[13px] tracking-wide transition-colors duration-150 underline-thin',
                  active
                    ? 'text-(color:--color-ink) font-medium'
                    : 'text-(color:--color-ink-soft) hover:text-(color:--color-ink)',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={appUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-(color:--color-oxblood) text-(color:--color-paper) px-5 py-2.5 text-[12px] tracking-wide hover:bg-(color:--color-oxblood-deep) transition-colors shadow-[inset_0_-1px_0_color-mix(in_oklch,_black_18%,_transparent)]"
          >
            Acessar o app
            <svg viewBox="0 0 12 12" className="size-2.5" fill="none" aria-hidden>
              <path
                d="M3 9L9 3M9 3H4M9 3V8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </a>
        </div>

        <MobileMenu items={navItems} appUrl={appUrl} />
      </div>
    </header>
  );
}
