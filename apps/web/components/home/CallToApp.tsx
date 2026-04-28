import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';

export function CallToApp() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.acampamentosantarita.com.br';

  return (
    <section className="relative py-24 lg:py-32">
      <Container width="editorial">
        <div className="relative overflow-hidden rounded-(--radius-lg) bg-(color:--color-oxblood) text-(color:--color-paper) p-8 lg:p-16">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '14px 14px',
            }}
          />
          <div
            aria-hidden
            className="absolute -top-32 -right-32 size-[420px] rounded-full bg-(color:--color-gold)/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-40 size-[420px] rounded-full bg-(color:--color-paper)/10 blur-3xl"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 text-(color:--color-paper)/85">
                <Logomark size={22} tone="paper" />
                <span className="eyebrow text-(color:--color-paper)/70">
                  Comunidade · Aplicativo
                </span>
              </div>
              <h2
                className="font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.02] tracking-tight"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
              >
                Inscrições, comunicados, tribos e financeiro.{' '}
                <span
                  className="italic text-(color:--color-gold)"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                >
                  Tudo num só lugar.
                </span>
              </h2>
              <p className="text-[15px] lg:text-[16px] leading-[1.6] text-(color:--color-paper)/80 max-w-2xl text-pretty">
                O app da comunidade reúne tudo o que você precisa para participar: cadastro,
                inscrição em eventos, pagamentos, notícias, sua tribo e equipe. Funciona offline e
                cabe no bolso.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button href={appUrl} external size="lg" variant="gold">
                  Acessar o app
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
                    <path
                      d="M3 9L9 3M9 3H4M9 3V8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </Button>
                <a
                  href="/faq"
                  className="text-[13px] text-(color:--color-paper)/85 hover:text-(color:--color-paper) underline-thin"
                >
                  Como funciona →
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <Feature
                icon={
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                    <rect
                      x="4"
                      y="6"
                      width="16"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M4 10H20M9 4V8M15 4V8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title="Inscrição em minutos"
                body="Faça sua ficha uma vez e use em todos os eventos."
              />
              <Feature
                icon={
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                    <path
                      d="M3 12L9 18L21 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Aprovação acompanhada"
                body="Você vê o status da inscrição em tempo real."
              />
              <Feature
                icon={
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M12 7V12L15.5 14"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title="Avisos e push"
                body="Receba só o que importa, no momento certo."
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-(--radius-md) bg-(color:--color-paper)/8 backdrop-blur-sm p-4 border border-(color:--color-paper)/10">
      <span className="size-9 inline-flex items-center justify-center rounded-full bg-(color:--color-paper)/15 text-(color:--color-paper) shrink-0">
        {icon}
      </span>
      <div>
        <p
          className="font-display text-lg leading-tight tracking-tight text-(color:--color-paper)"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {title}
        </p>
        <p className="text-[12px] text-(color:--color-paper)/70 leading-relaxed mt-0.5">{body}</p>
      </div>
    </div>
  );
}
