import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { type GalleryPhoto, useGalleryAlbum } from '@/lib/queries/cms';
import { mediaUrl } from '@/lib/queries/profile';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/galeria/$slug')({
  component: AlbumDetalhe,
});

function AlbumDetalhe() {
  const { slug } = Route.useParams();
  const { data: album, isLoading, isError } = useGalleryAlbum(slug);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/galeria" title="Álbum" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  if (isError || !album) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/galeria" title="Álbum" border />
        <div className="px-6 py-16 text-center">
          <p className="font-display text-2xl">Álbum não encontrado.</p>
        </div>
      </Page>
    );
  }

  const photos = album.photos;
  const open = openIndex !== null ? photos[openIndex] : null;

  return (
    <Page>
      <TopBar back="/galeria" title={album.name} border />

      <div className="px-5 pt-3 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
          {album.event ? `${new Date(album.event.startDate).getFullYear()} · ` : ''}
          {photos.length === 0
            ? 'em breve'
            : `${photos.length} ${photos.length === 1 ? 'foto' : 'fotos'}`}
        </p>
        {album.description && (
          <p className="text-sm text-(color:--color-muted-foreground) mt-2 leading-relaxed text-pretty">
            {album.description}
          </p>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <p className="text-[15px] text-(color:--color-muted-foreground)">
            As fotos deste álbum ainda não foram publicadas.
          </p>
        </div>
      ) : (
        <div className="px-1 grid grid-cols-3 gap-1 pb-8">
          {photos.map((p, i) => {
            const url = mediaUrl(p.imageUrl) ?? p.imageUrl;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenIndex(i)}
                className="aspect-square rounded-sm overflow-hidden relative active:scale-95 transition bg-(color:--color-muted)"
                aria-label={p.caption ?? 'Foto'}
              >
                <img
                  src={url}
                  alt={p.caption ?? ''}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {open && openIndex !== null && (
        <Lightbox
          photo={open}
          index={openIndex}
          total={photos.length}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i! - 1 + photos.length) % photos.length)}
          onNext={() => setOpenIndex((i) => (i! + 1) % photos.length)}
        />
      )}
    </Page>
  );
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  photo: GalleryPhoto;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const url = mediaUrl(photo.imageUrl) ?? photo.imageUrl;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      <motion.img
        key={photo.id}
        src={url}
        alt={photo.caption ?? ''}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-full max-h-[80vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 backdrop-blur-md text-white text-xl font-mono inline-flex items-center justify-center"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 backdrop-blur-md text-white text-xl font-mono inline-flex items-center justify-center"
            aria-label="Próxima"
          >
            ›
          </button>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 size-10 rounded-full bg-white/10 backdrop-blur-md text-white inline-flex items-center justify-center"
        aria-label="Fechar"
      >
        <X className="size-5" strokeWidth={1.5} />
      </button>
      <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 font-mono text-[11px] uppercase tracking-wider px-6">
        {photo.caption && <p className="mb-2 normal-case">{photo.caption}</p>}
        {index + 1} de {total}
      </div>
    </motion.div>
  );
}
