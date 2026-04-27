import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://acampamentosantarita.com.br';
  // TODO: inclir slugs dinâmicos (eventos publicados, posts, álbuns) via GET /public/*.
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/sobre`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/eventos`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/galeria`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/lojinha`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, changeFrequency: 'yearly', priority: 0.4 },
  ];
}
