import { Link, createFileRoute } from '@tanstack/react-router';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { galleryAlbums } from '@/mock/data';

export const Route = createFileRoute('/_auth/galeria/')({
  component: GaleriaIndex,
});

function GaleriaIndex() {
  // Group by year
  const byYear = galleryAlbums.reduce<Record<number, typeof galleryAlbums>>((acc, a) => {
    if (!acc[a.year]) acc[a.year] = [];
    acc[a.year]!.push(a);
    return acc;
  }, {});
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow="Memória"
        title={
          <>
            <span className="font-display-italic">Galeria.</span>
          </>
        }
        description="Fotos dos retiros, encontros e acampamentos passados."
        className="pt-12"
      />

      <div className="px-5 grid gap-7 pb-8">
        {years.map((year) => (
          <section key={year}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-3">
              {year}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {byYear[year]!.map((a) => (
                <Link
                  key={a.id}
                  to="/galeria/$slug"
                  params={{ slug: a.slug }}
                  className="group block"
                >
                  <div
                    className="aspect-[4/5] rounded-(--radius-md) overflow-hidden relative"
                    style={{ backgroundImage: a.cover }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-noise" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <p
                        className="font-display text-base leading-tight tracking-tight text-balance"
                        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                      >
                        {a.name}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider opacity-80 mt-0.5">
                        {a.photos} fotos
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}
