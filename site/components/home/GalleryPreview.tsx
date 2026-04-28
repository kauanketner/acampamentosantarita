import { Button } from '@/components/ui/Button';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { fetchPublicSafe } from '@/lib/api';
import type { PublicGalleryAlbum } from '@/lib/types';
import Link from 'next/link';

export async function GalleryPreview() {
  const data = await fetchPublicSafe<{ items: PublicGalleryAlbum[] }>(
    '/gallery',
    { items: [] },
    { revalidate: 600 },
  );

  const albums = (data.items ?? []).slice(0, 6);

  // Fallback: render with placeholder cards
  const fallbackData = [
    { name: 'Acampamento XX', count: 142 },
    { name: 'Retiro de Páscoa', count: 86 },
    { name: 'Encontro de Equipistas', count: 54 },
    { name: 'Acampamento XXI', count: 168 },
    { name: 'Festa de Santa Rita', count: 73 },
    { name: 'Retiro de Quaresma', count: 98 },
  ];
  const fallback: PublicGalleryAlbum[] = fallbackData.map((d, i) => ({
    id: `placeholder-${i}`,
    slug: `memoria-${i}`,
    name: d.name,
    description: null,
    coverImageUrl: null,
    photoCount: d.count,
    event: null,
  }));

  const items = albums.length > 0 ? albums : fallback;

  return (
    <section className="relative py-24 lg:py-32">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <Chapter
            numeral="III"
            eyebrow="Capítulo três · Memória"
            title={
              <>
                A história{' '}
                <span
                  className="italic text-(color:--color-oxblood)"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                >
                  guardada em imagens.
                </span>
              </>
            }
            description="Cada acampamento deixa um traço. A galeria é como um álbum aberto — entre sem cerimônia."
          />
          <Button href="/galeria" variant="outline" size="md">
            Abrir a galeria →
          </Button>
        </div>

        {/* Mosaic asymmetric grid */}
        <div className="grid grid-cols-12 grid-rows-2 gap-3 lg:gap-4 h-[480px] lg:h-[600px] stagger">
          {items.slice(0, 6).map((album, i) => {
            const span = mosaicSpans[i] ?? 'col-span-4 row-span-1';
            return (
              <Link
                key={album.id}
                href={`/galeria/${album.slug}`}
                className={`group relative paper-card overflow-hidden rounded-(--radius-md) animate-drift-up ${span}`}
              >
                <div
                  className="absolute inset-0 vignette transition-transform duration-700 group-hover:scale-[1.04]"
                  style={
                    album.coverImageUrl
                      ? {
                          backgroundImage: `url(${album.coverImageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {
                          background: gradientForIndex(i),
                        }
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-(color:--color-ink)/85 via-(color:--color-ink)/0 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-5 text-(color:--color-paper)">
                  <span className="eyebrow text-(color:--color-paper)/70 mb-1.5">
                    {album.photoCount} fotos
                  </span>
                  <p
                    className="font-display text-xl lg:text-2xl leading-tight tracking-tight"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                  >
                    {album.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

const mosaicSpans = [
  'col-span-12 md:col-span-7 row-span-2',
  'col-span-12 md:col-span-5 row-span-1',
  'col-span-6 md:col-span-3 row-span-1',
  'col-span-6 md:col-span-2 row-span-1',
  'col-span-6 md:col-span-3 row-span-1',
  'col-span-12 md:col-span-4 row-span-1',
];

const palettes = [
  'linear-gradient(135deg, oklch(0.36 0.13 22), oklch(0.5 0.13 30))',
  'linear-gradient(135deg, oklch(0.42 0.07 130), oklch(0.55 0.09 110))',
  'linear-gradient(135deg, oklch(0.6 0.13 70), oklch(0.45 0.12 50))',
  'linear-gradient(135deg, oklch(0.3 0.1 25), oklch(0.4 0.12 35))',
  'linear-gradient(135deg, oklch(0.5 0.12 45), oklch(0.6 0.1 80))',
  'linear-gradient(135deg, oklch(0.38 0.1 15), oklch(0.48 0.13 30))',
] as const;

function gradientForIndex(i: number): string {
  return palettes[i % palettes.length] ?? palettes[0];
}
