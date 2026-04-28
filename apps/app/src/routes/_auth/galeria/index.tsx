import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { eventGradient } from '@/lib/format';
import { type GalleryAlbumLite, useGalleryAlbums } from '@/lib/queries/cms';
import { mediaUrl } from '@/lib/queries/profile';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Camera, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/_auth/galeria/')({
  component: GaleriaIndex,
});

function GaleriaIndex() {
  const { data: albums, isLoading, isError } = useGalleryAlbums();

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow="Memória"
        title=<span className="font-display-italic">Galeria.</span>
        description="Fotos dos retiros, encontros e acampamentos passados."
        className="pt-12"
      />

      {isLoading && (
        <div className="flex justify-center py-16 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {isError && (
        <EmptyState
          className="py-16"
          icon={<Camera className="size-10" strokeWidth={1.2} />}
          title="Não conseguimos buscar"
          description="Tente daqui a pouco."
        />
      )}

      {albums && albums.length === 0 && (
        <EmptyState
          className="py-16"
          icon={<Camera className="size-10" strokeWidth={1.2} />}
          title="Sem álbuns por aqui"
          description="Quando a coordenação publicar fotos de eventos, elas aparecem aqui."
        />
      )}

      {albums && albums.length > 0 && <AlbumGrid albums={albums} />}
    </Page>
  );
}

function AlbumGrid({ albums }: { albums: GalleryAlbumLite[] }) {
  // Agrupa por ano (do startDate do evento, ou createdAt do álbum como fallback).
  const byYear = albums.reduce<Record<number, GalleryAlbumLite[]>>((acc, a) => {
    const isoForYear = a.event?.startDate ?? a.createdAt;
    const year = new Date(isoForYear).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year]!.push(a);
    return acc;
  }, {});
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="px-5 grid gap-7 pb-8">
      {years.map((year) => (
        <section key={year}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-3">
            {year}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {byYear[year]!.map((a) => (
              <AlbumTile key={a.id} album={a} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AlbumTile({ album }: { album: GalleryAlbumLite }) {
  const cover = mediaUrl(album.coverUrl);
  const grad = eventGradient(album.id);
  return (
    <Link to="/galeria/$slug" params={{ slug: album.slug }} className="group block">
      <div
        className="aspect-[4/5] rounded-(--radius-md) overflow-hidden relative"
        style={{
          backgroundImage: cover
            ? `url("${cover}")`
            : `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-noise" />
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <p
            className="font-display text-base leading-tight tracking-tight text-balance"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {album.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-80 mt-0.5">
            {album.photoCount === 0
              ? 'em breve'
              : `${album.photoCount} ${album.photoCount === 1 ? 'foto' : 'fotos'}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
