import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/blog', label: 'Blog' },
  { href: '/lojinha', label: 'Lojinha' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contato', label: 'Contato' },
];

export function Header() {
  // TODO: variante mobile (hamburger → MobileMenu) e versão "transparent over hero".
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.acampamentosantarita.com.br';

  return (
    <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="container max-w-6xl flex items-center justify-between py-5 px-6">
        <Link href="/" className="font-serif text-xl">
          Santa Rita
        </Link>
        <nav className="hidden md:flex gap-7 text-sm text-muted-foreground">
          {navItems.map((i) => (
            <Link key={i.href} href={i.href} className="hover:text-foreground transition">
              {i.label}
            </Link>
          ))}
        </nav>
        <a
          href={appUrl}
          className="hidden md:inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition"
        >
          Baixe o app
        </a>
        {/* TODO: trigger do MobileMenu */}
      </div>
    </header>
  );
}
