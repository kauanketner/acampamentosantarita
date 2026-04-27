import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { galleryAlbums } from '@/mock/data';
import { cn } from '@/lib/cn';
import { X } from 'lucide-react';

export const Route = createFileRoute('/_auth/galeria/$slug')({
  component: AlbumDetalhe,
});

// Mock photos — gradient tiles to simulate
const TILE_COUNT = 24;

function AlbumDetalhe() {
  const { slug } = Route.useParams();
  const album = galleryAlbums.find((a) => a.slug === slug);
  const [open, setOpen] = useState<number | null>(null);

  if (!album) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/galeria" title="Álbum" />
        <div className="px-6 py-12 text-center">
          <p className="font-display text-2xl">Álbum não encontrado.</p>
        </div>
      </Page>
    );
  }

  const tiles = Array.from({ length: TILE_COUNT }, (_, i) => i);

  return (
    <Page>
      <TopBar back="/galeria" title={album.name} border />

      <div className="px-5 pt-3 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
          {album.year} · {album.photos} fotos
        </p>
      </div>

      <div className="px-1 grid grid-cols-3 gap-1 pb-8">
        {tiles.map((i) => {
          const hue = 35 + ((i * 17) % 60);
          const lightness = 0.35 + ((i * 7) % 30) / 100;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className="aspect-square rounded-sm overflow-hidden relative active:scale-95 transition"
              style={{
                backgroundImage: `linear-gradient(${(i * 23) % 180}deg, oklch(${lightness} 0.075 ${hue}), oklch(${lightness + 0.18} 0.085 ${hue + 20}))`,
              }}
            >
              <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-noise" />
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setOpen(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'relative w-full h-[80vh] mx-6 rounded-(--radius-md) overflow-hidden',
            )}
            style={{
              backgroundImage: `linear-gradient(${(open * 23) % 180}deg, oklch(0.4 0.075 ${35 + ((open * 17) % 60)}), oklch(0.6 0.085 ${55 + ((open * 17) % 60)}))`,
            }}
          >
            <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-noise" />
          </motion.div>
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 size-10 rounded-full bg-white/10 backdrop-blur-md text-white inline-flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
          <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 font-mono text-[11px] uppercase tracking-wider">
            {open + 1} de {tiles.length}
          </div>
        </motion.div>
      )}
    </Page>
  );
}
