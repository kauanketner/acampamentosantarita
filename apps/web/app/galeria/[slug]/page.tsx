import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { fetchPublicSafe } from '@/lib/api';
import type { PublicGalleryAlbumDetail } from '@/lib/types';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await fetchPublicSafe<PublicGalleryAlbumDetail | null>(`/gallery/${slug}`, null);
  if (!album) return { title: 'Álbum não encontrado' };
  return {
    title: album.name,
    description: album.description ?? `Galeria · ${album.name}`,
  };
}

export default async function AlbumDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const album = await fetchPublicSafe<PublicGalleryAlbumDetail | null>(`/gallery/${slug}`, null);

  if (!album) notFound();

  return (
    <>
      <section className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 6%, transparent), transparent 60%)',
          }}
        />
        <Container width="editorial" className="relative pt-10 lg:pt-16 pb-10 lg:pb-16">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-1.5 eyebrow text-(color:--color-ink-faint) hover:text-(color:--color-ink) transition-colors mb-8"
          >
            <span aria-hidden>←</span> Galeria
          </Link>
          <p className="eyebrow mb-3">
            {album.photoCount} {album.photoCount === 1 ? 'fotografia' : 'fotografias'}
          </p>
          <h1
            className="font-display leading-[1] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4.75rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            {album.name}
          </h1>
          {album.description && (
            <p
              className="mt-6 font-display italic text-[20px] lg:text-[22px] leading-[1.45] text-(color:--color-ink-soft) max-w-2xl text-pretty"
              style={{ fontVariationSettings: "'opsz' 32, 'SOFT' 90" }}
            >
              {album.description}
            </p>
          )}
          {album.event && (
            <p className="mt-4 text-[12px] text-(color:--color-ink-faint)">
              <span className="text-(color:--color-rule-strong)">Evento · </span>
              <Link
                href={`/eventos/${album.event.id}`}
                className="text-(color:--color-oxblood) underline-thin"
              >
                {album.event.name}
              </Link>
            </p>
          )}
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container width="wide">
          {album.photos.length === 0 ? (
            <div className="paper-card rounded-(--radius-md) p-12 text-center text-(color:--color-ink-soft)">
              <p>O álbum ainda está vazio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {album.photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block paper-card rounded-(--radius-sm) overflow-hidden aspect-square relative vignette"
                  style={{
                    backgroundImage: `url(${photo.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-(color:--color-ink)/0 group-hover:bg-(color:--color-ink)/30 transition-colors" />
                  {photo.caption && (
                    <span className="absolute bottom-2 left-2 right-2 text-[10px] text-(color:--color-paper) opacity-0 group-hover:opacity-100 transition-opacity bg-(color:--color-ink)/60 backdrop-blur-sm rounded px-2 py-1">
                      {photo.caption}
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 border-t border-(color:--color-rule) bg-(color:--color-paper-2)/40">
        <Container width="reading" className="text-center">
          <p className="eyebrow mb-3">Continue navegando</p>
          <p
            className="font-display italic text-2xl text-(color:--color-ink-soft)"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          >
            Há outros álbuns esperando.
          </p>
          <div className="mt-6">
            <Button href="/galeria" variant="outline">
              Voltar pra galeria
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
