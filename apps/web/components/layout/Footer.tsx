import { Logomark } from '@/components/ui/Logo';
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.acampamentosantarita.com.br';

  return (
    <footer className="relative mt-32 bg-(color:--color-ink) text-(color:--color-paper)">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '14px 14px',
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-(color:--color-paper)/15">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="text-(color:--color-paper)">
                <Logomark size={36} />
              </span>
              <div>
                <p
                  className="font-display text-2xl leading-none tracking-tight italic"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 70" }}
                >
                  Santa Rita
                </p>
                <p className="eyebrow text-(color:--color-paper)/60 mt-2">
                  Comunidade · Acampamento
                </p>
              </div>
            </div>
            <p
              className="font-display italic text-2xl leading-snug max-w-md text-(color:--color-paper)/90"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              “Cada nome é uma alma; cada inscrição, um passo.”
            </p>
            <p className="text-[13px] text-(color:--color-paper)/55 leading-relaxed max-w-md">
              Comunidade de fé que se reúne em acampamentos, retiros e encontros. Há mais de duas
              décadas dizendo sim, juntos — sob a intercessão de Santa Rita das Cássia.
            </p>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <p className="eyebrow text-(color:--color-paper)/55 mb-2">Comunidade</p>
            <FooterLink href="/sobre">A história</FooterLink>
            <FooterLink href="/eventos">Próximos eventos</FooterLink>
            <FooterLink href="/galeria">Galeria</FooterLink>
            <FooterLink href="/blog">Diário</FooterLink>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <p className="eyebrow text-(color:--color-paper)/55 mb-2">Apoie</p>
            <FooterLink href="/lojinha">Lojinha</FooterLink>
            <FooterLink href="/contato">Doe</FooterLink>
            <FooterLink href="/contato">Voluntariado</FooterLink>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <p className="eyebrow text-(color:--color-paper)/55 mb-2">Comece</p>
            <a
              href={appUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-[13px] text-(color:--color-paper)/85 hover:text-(color:--color-paper) transition-colors underline-thin"
            >
              Acessar o app →
            </a>
            <FooterLink href="/contato">Falar com a coordenação</FooterLink>
            <FooterLink href="/faq">Dúvidas frequentes</FooterLink>
          </div>
        </div>

        <div className="py-10">
          <div className="ornament text-(color:--color-paper)/15">
            <span className="text-(color:--color-gold)/85">
              <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
                <g fill="currentColor">
                  <ellipse cx="8" cy="3" rx="1" ry="2.5" />
                  <ellipse cx="8" cy="13" rx="1" ry="2.5" />
                  <ellipse cx="3" cy="8" rx="2.5" ry="1" />
                  <ellipse cx="13" cy="8" rx="2.5" ry="1" />
                  <circle cx="8" cy="8" r="1.4" />
                </g>
              </svg>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12px] text-(color:--color-paper)/55">
          <div className="space-y-1.5">
            <p>
              <span className="text-(color:--color-paper)/40">E-mail · </span>
              <a
                href="mailto:contato@acampamentosantarita.com.br"
                className="text-(color:--color-paper)/85 hover:text-(color:--color-paper)"
              >
                contato@acampamentosantarita.com.br
              </a>
            </p>
            <p>
              <span className="text-(color:--color-paper)/40">WhatsApp · </span>
              <a
                href="https://wa.me/5511000000000"
                target="_blank"
                rel="noreferrer"
                className="text-(color:--color-paper)/85 hover:text-(color:--color-paper)"
              >
                (11) 0000-0000
              </a>
            </p>
            <p className="text-(color:--color-paper)/45">
              Paróquia Santa Rita das Cássia · São Paulo, SP
            </p>
          </div>

          <div className="md:text-right space-y-1.5">
            <div className="flex md:justify-end gap-5">
              <Link
                href="/politica-de-privacidade"
                className="hover:text-(color:--color-paper)/90 underline-thin"
              >
                Política de privacidade
              </Link>
              <Link
                href="/termos-de-uso"
                className="hover:text-(color:--color-paper)/90 underline-thin"
              >
                Termos de uso
              </Link>
            </div>
            <p className="text-[11px] text-(color:--color-paper)/40">
              © {year} Comunidade Acampamento Santa Rita
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-[13px] text-(color:--color-paper)/75 hover:text-(color:--color-paper) transition-colors"
    >
      {children}
    </Link>
  );
}
