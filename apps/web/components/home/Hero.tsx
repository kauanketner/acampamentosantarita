import { Button } from '@/components/ui/Button';
import { Logomark } from '@/components/ui/Logo';
import Link from 'next/link';

export function Hero() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.acampamentosantarita.com.br';

  return (
    <section className="relative overflow-hidden">
      {/* Decorative top frame */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 10%, transparent), transparent 40%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -right-32 top-32 size-[460px] rounded-full bg-(color:--color-oxblood)/8 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -left-40 top-80 size-[360px] rounded-full bg-(color:--color-gold)/12 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10 pt-12 lg:pt-20 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* Texto principal */}
          <div className="lg:col-span-7 space-y-7 stagger animate-drift-up">
            <div className="flex items-center gap-3 text-(color:--color-ink-faint)">
              <Logomark size={20} tone="oxblood" />
              <span className="eyebrow">Edição XXII · Inscrições abertas</span>
            </div>

            <h1
              className="font-display leading-[0.95] tracking-[-0.025em] text-(color:--color-ink) text-balance"
              style={{
                fontSize: 'clamp(3rem, 8.4vw, 7.25rem)',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
              }}
            >
              <span className="block">Há um lugar</span>
              <span className="block">
                onde Deus{' '}
                <span
                  className="italic text-(color:--color-oxblood)"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                >
                  espera
                </span>
              </span>
              <span className="block">por você.</span>
            </h1>

            <p
              className="font-display italic text-[20px] lg:text-[22px] leading-[1.45] text-(color:--color-ink-soft) max-w-xl text-pretty"
              style={{ fontVariationSettings: "'opsz' 32, 'SOFT' 70" }}
            >
              Comunidade de fé que se reúne em acampamentos, retiros e encontros. Há mais de duas
              décadas dizendo sim, juntos — sob a intercessão de Santa Rita das Cássia.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button href={appUrl} external size="lg">
                Inscrever-se pelo app
                <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
                  <path
                    d="M3 9L9 3M9 3H4M9 3V8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
              <Button href="/sobre" variant="outline" size="lg">
                Conhecer a comunidade
              </Button>
            </div>

            <div className="pt-6 flex items-center gap-6 text-[12px] text-(color:--color-ink-faint)">
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-(color:--color-moss) animate-drift-fade" />
                Próximo acampamento em julho
              </span>
              <Link href="/eventos" className="underline-thin hover:text-(color:--color-ink)">
                Ver agenda completa →
              </Link>
            </div>
          </div>

          {/* Marca composta — fonte gigante decorativa */}
          <aside className="lg:col-span-5 relative animate-drift-fade">
            <div className="paper-card aspect-[3/4] relative overflow-hidden vignette rounded-(--radius-md)">
              {/* Hand-painted style background using CSS gradients */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 60% at 50% 35%, color-mix(in oklch, var(--color-gold) 28%, transparent), transparent), radial-gradient(ellipse 80% 80% at 50% 90%, color-mix(in oklch, var(--color-oxblood) 22%, transparent), transparent), linear-gradient(180deg, var(--color-paper-2), var(--color-paper))',
                }}
              />
              {/* Big italic flourish */}
              <div className="relative h-full flex flex-col justify-between p-8">
                <div className="flex items-start justify-between">
                  <span className="eyebrow">Anno · MMXXVI</span>
                  <span aria-hidden className="text-(color:--color-accent-deep)">
                    <svg viewBox="0 0 16 16" className="size-4">
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

                <div className="space-y-3">
                  <p
                    className="font-display italic leading-[0.85] text-(color:--color-oxblood)"
                    style={{
                      fontSize: 'clamp(5rem, 14vw, 9rem)',
                      fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    }}
                  >
                    Santa
                  </p>
                  <p
                    className="font-display italic leading-[0.85] text-(color:--color-oxblood) text-right"
                    style={{
                      fontSize: 'clamp(5rem, 14vw, 9rem)',
                      fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    }}
                  >
                    Rita
                  </p>
                </div>

                <div className="flex items-end justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-(color:--color-ink-faint)">
                  <span>Acampamento</span>
                  <span>São Paulo · BR</span>
                </div>
              </div>
            </div>

            {/* Floating tag */}
            <div className="absolute -bottom-5 -left-5 lg:-left-10 paper-card rounded-(--radius-md) px-4 py-3 max-w-[220px] hidden md:block">
              <p className="eyebrow mb-1">Próximo encontro</p>
              <p
                className="font-display italic text-[18px] leading-tight text-(color:--color-ink)"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 70" }}
              >
                Acampamento de Verão
              </p>
              <p className="text-[11px] text-(color:--color-ink-faint) mt-1 tabular">
                17 — 20 de julho
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        <div className="ornament">
          <span className="text-(color:--color-accent-deep)">
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <g fill="currentColor">
                <ellipse cx="8" cy="3" rx="1" ry="2.5" />
                <ellipse cx="8" cy="13" rx="1" ry="2.5" />
                <ellipse cx="3" cy="8" rx="2.5" ry="1" />
                <ellipse cx="13" cy="8" rx="2.5" ry="1" />
                <ellipse cx="4.5" cy="4.5" rx="1.6" ry="1" transform="rotate(45 4.5 4.5)" />
                <ellipse cx="11.5" cy="11.5" rx="1.6" ry="1" transform="rotate(45 11.5 11.5)" />
                <ellipse cx="11.5" cy="4.5" rx="1.6" ry="1" transform="rotate(-45 11.5 4.5)" />
                <ellipse cx="4.5" cy="11.5" rx="1.6" ry="1" transform="rotate(-45 4.5 11.5)" />
                <circle cx="8" cy="8" r="1.4" fill="currentColor" />
              </g>
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
