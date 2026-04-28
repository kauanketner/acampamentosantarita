import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import { fetchPublicSafe } from '@/lib/api';
import type { PublicGalleryAlbum } from '@/lib/types';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Galeria',
  description:
    'Memória viva da comunidade Acampamento Santa Rita. Cada acampamento deixa um traço — entre sem cerimônia.',
};

export const dynamic = 'force-dynamic';

export default async function GaleriaPage() {
  const data = await fetchPublicSafe<{ items: PublicGalleryAlbum[] }>(
    '/gallery',
    { items: [] },
    { revalidate: 600 },
  );
  const albums = data.items ?? [];

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
        <Container width="wide" className="relative pt-12 lg:pt-20 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <Logomark size={22} tone="oxblood" />
            <span className="eyebrow">Memória · Galeria</span>
          </div>

          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            Cada acampamento{' '}
            <span
              className="italic text-(color:--color-oxblood)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              deixa um traço.
            </span>
          </h1>
          <p className="mt-6 text-[16px] lg:text-[17px] text-(color:--color-ink-soft) max-w-2xl leading-relaxed text-pretty">
            Fotografias da comunidade — celebrações, cantorias, mesas, silêncios. Os álbuns ficam
            abertos pra quem quiser visitar a memória.
          </p>
        </Container>
      </section>

      <section className="relative pb-24 lg:pb-32">
        <Container width="wide">
          {albums.length === 0 ? (
            <Empty />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function AlbumCard({ album }: { album: PublicGalleryAlbum }) {
  return (
    <Link
      href={`/galeria/${album.slug}`}
      className="group relative paper-card rounded-(--radius-md) overflow-hidden block hover:-translate-y-0.5 hover:shadow-[0_10px_30px_color-mix(in_oklch,_black_8%,_transparent)] transition-all duration-300"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden vignette"
        style={
          album.coverImageUrl
            ? {
                backgroundImage: `url(${album.coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {
                background:
                  'radial-gradient(ellipse at 30% 30%, color-mix(in oklch, var(--color-gold) 35%, transparent), transparent), radial-gradient(ellipse at 80% 90%, color-mix(in oklch, var(--color-oxblood) 30%, transparent), transparent), linear-gradient(180deg, var(--color-paper-2), var(--color-paper))',
              }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-(color:--color-ink)/55 via-transparent to-transparent transition-opacity group-hover:opacity-80" />
        {!album.coverImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display italic text-(color:--color-oxblood)/30 text-[clamp(3rem,8vw,5rem)] leading-none select-none"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              aria-hidden
            >
              ❀
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 text-(color:--color-paper)">
          <p className="eyebrow text-(color:--color-paper)/75 mb-1">
            {album.photoCount} {album.photoCount === 1 ? 'foto' : 'fotos'}
          </p>
          <p
            className="font-display text-2xl leading-tight tracking-tight text-pretty"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {album.name}
          </p>
        </div>
      </div>
      {album.description && (
        <div className="p-5">
          <p className="text-[13px] text-(color:--color-ink-soft) line-clamp-2 leading-relaxed">
            {album.description}
          </p>
        </div>
      )}
    </Link>
  );
}

function Empty() {
  return (
    <div className="paper-card rounded-(--radius-md) p-12 lg:p-16 text-center max-w-2xl mx-auto">
      <div className="ornament mb-6">
        <span className="text-(color:--color-accent-deep)">❀</span>
      </div>
      <h2
        className="font-display text-3xl tracking-tight text-(color:--color-ink)"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
      >
        A galeria ainda está em revelação.
      </h2>
      <p className="mt-4 text-(color:--color-ink-soft) leading-relaxed max-w-md mx-auto">
        Em breve abriremos os primeiros álbuns. Enquanto isso, conheça a comunidade ou os próximos
        eventos.
      </p>
    </div>
  );
}
