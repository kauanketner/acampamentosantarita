import { fetchPublicSafe } from '@/lib/api';
import type { PublicEvent, PublicGalleryAlbum } from '@/lib/types';
import type { MetadataRoute } from 'next';

const base = 'https://acampamentosantarita.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, albums] = await Promise.all([
    fetchPublicSafe<{ items: PublicEvent[] }>('/upcoming-events', { items: [] }),
    fetchPublicSafe<{ items: PublicGalleryAlbum[] }>('/gallery', { items: [] }),
  ]);

  const eventEntries: MetadataRoute.Sitemap = (events.items ?? []).map((e) => ({
    url: `${base}/eventos/${e.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const albumEntries: MetadataRoute.Sitemap = (albums.items ?? []).map((a) => ({
    url: `${base}/galeria/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Posts (seed estático até a API CMS ficar pronta)
  const postSlugs = [
    'sobre-o-silencio-e-o-fogo',
    'cartas-de-uma-equipista',
    'a-mesa-e-o-altar',
    'memoria-do-acampamento-xxi',
  ];
  const postEntries: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/sobre`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/eventos`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/galeria`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/lojinha`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/politica-de-privacidade`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/termos-de-uso`, changeFrequency: 'yearly', priority: 0.2 },
    ...eventEntries,
    ...albumEntries,
    ...postEntries,
  ];
}
