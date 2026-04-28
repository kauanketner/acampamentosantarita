import { ContactForm } from '@/components/ui/ContactForm';
import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com a coordenação da comunidade Acampamento Santa Rita. WhatsApp, e-mail ou formulário — você escolhe.',
};

export default function ContatoPage() {
  return (
    <>
      <section className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 8%, transparent), transparent 50%)',
          }}
        />
        <Container width="editorial" className="relative pt-12 lg:pt-20 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <Logomark size={22} tone="oxblood" />
            <span className="eyebrow">Contato · Coordenação</span>
          </div>
          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            Pode escrever{' '}
            <span
              className="italic text-(color:--color-oxblood)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              sem cerimônia.
            </span>
          </h1>
          <p className="mt-6 text-[16px] lg:text-[17px] text-(color:--color-ink-soft) max-w-2xl leading-relaxed text-pretty">
            A coordenação lê tudo. Pra dúvidas rápidas, o WhatsApp é o caminho mais curto. Pra
            conversas mais longas, o e-mail. Pro resto — o formulário ali embaixo é seu.
          </p>
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container width="editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Aside: contatos diretos */}
            <aside className="lg:col-span-5 space-y-4">
              <ContactCard
                eyebrow="Mais rápido"
                title="WhatsApp"
                value="(11) 0000-0000"
                href="https://wa.me/5511000000000"
                external
                hint="Resposta em até 4h em dias úteis."
                icon={
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                    <path
                      d="M20 4C16.5 4 13.5 6 12 9C10.5 6 7.5 4 4 4C4 7 5.5 10 8 12C5.5 14 4 17 4 20C7.5 20 10.5 18 12 15C13.5 18 16.5 20 20 20C20 17 18.5 14 16 12C18.5 10 20 7 20 4Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <ContactCard
                eyebrow="Mais detalhado"
                title="E-mail"
                value="contato@acampamentosantarita.com.br"
                href="mailto:contato@acampamentosantarita.com.br"
                hint="Pra propostas, parcerias, imprensa."
                icon={
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="13"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M3 8L12 14L21 8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <ContactCard
                eyebrow="Onde a gente fica"
                title="Paróquia Santa Rita das Cássia"
                value="Rua exemplo, 100 · São Paulo · SP"
                hint="Atendimento da comunidade: terça, 19h às 21h."
                icon={
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                    <path
                      d="M12 21S5 15 5 10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10C19 15 12 21 12 21Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                }
              />

              <div className="paper-card rounded-(--radius-md) p-6 text-center">
                <p className="eyebrow mb-3">Redes</p>
                <div className="flex items-center justify-center gap-3">
                  <SocialLink
                    href="https://instagram.com/"
                    label="Instagram"
                    svg={
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                      </svg>
                    }
                  />
                  <SocialLink
                    href="https://youtube.com/"
                    label="YouTube"
                    svg={
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <rect
                          x="3"
                          y="6"
                          width="18"
                          height="12"
                          rx="3"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <path d="M11 9.5L14.5 12L11 14.5V9.5Z" fill="currentColor" />
                      </svg>
                    }
                  />
                  <SocialLink
                    href="https://facebook.com/"
                    label="Facebook"
                    svg={
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <path
                          d="M14 8H16V5H14C12.5 5 11 6 11 8V10H9V13H11V20H14V13H16L17 10H14V8Z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

function ContactCard({
  eyebrow,
  title,
  value,
  hint,
  href,
  external,
  icon,
}: {
  eyebrow: string;
  title: string;
  value: string;
  hint?: string;
  href?: string;
  external?: boolean;
  icon: React.ReactNode;
}) {
  const inner = (
    <>
      <div className="flex items-start gap-4">
        <span className="size-10 inline-flex items-center justify-center rounded-full bg-(color:--color-oxblood-soft) text-(color:--color-oxblood) shrink-0">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow mb-1.5">{eyebrow}</p>
          <p
            className="font-display text-xl tracking-tight leading-tight text-(color:--color-ink)"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {title}
          </p>
          <p className="text-[13px] text-(color:--color-ink-soft) mt-1.5 break-words">{value}</p>
          {hint && (
            <p className="text-[11px] text-(color:--color-ink-faint) mt-2.5 leading-relaxed">
              {hint}
            </p>
          )}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="paper-card rounded-(--radius-md) p-6 block hover:bg-(color:--color-paper-2)/40 transition-colors"
      >
        {inner}
      </a>
    );
  }
  return <div className="paper-card rounded-(--radius-md) p-6">{inner}</div>;
}

function SocialLink({ href, label, svg }: { href: string; label: string; svg: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="size-10 rounded-full inline-flex items-center justify-center border border-(color:--color-rule) text-(color:--color-ink-soft) hover:bg-(color:--color-oxblood) hover:text-(color:--color-paper) hover:border-(color:--color-oxblood) transition-colors"
    >
      {svg}
    </a>
  );
}
