import { Container } from '@/components/ui/Container';

const stats = [
  { number: 'XXII', label: 'Edições do acampamento', sub: 'desde 2003' },
  { number: '4 800+', label: 'Pessoas que passaram', sub: 'campistas e equipistas' },
  { number: '120', label: 'Servidores ativos', sub: 'voluntários' },
  { number: '07', label: 'Eventos no ano', sub: 'além dos encontros mensais' },
];

export function NumbersStrip() {
  return (
    <section className="relative py-16 lg:py-20 border-y border-(color:--color-rule)">
      <Container width="wide">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-(color:--color-rule)/60 -mx-6 sm:-mx-8 lg:-mx-10">
          {stats.map((s) => (
            <div key={s.label} className="px-6 sm:px-8 lg:px-10 first:border-l-0">
              <p
                className="font-display tabular text-(color:--color-oxblood) leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(2rem, 4.4vw, 3.25rem)',
                  fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                }}
              >
                {s.number}
              </p>
              <p className="text-[13px] text-(color:--color-ink) mt-3 font-medium leading-tight">
                {s.label}
              </p>
              <p className="text-[11px] text-(color:--color-ink-faint) mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
