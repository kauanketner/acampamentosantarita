import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GalleryAlbumLite = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  eventId: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  event: { id: string; name: string; startDate: string } | null;
  photoCount: number;
};

export type GalleryPhoto = {
  id: string;
  albumId: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
};

export type GalleryAlbumDetail = Omit<GalleryAlbumLite, 'photoCount'> & {
  photos: GalleryPhoto[];
};

const FAQ_KEY = ['cms', 'faq'] as const;
const GALLERY_KEY = ['cms', 'gallery'] as const;
const galleryAlbumKey = (slug: string) => [...GALLERY_KEY, 'by-slug', slug] as const;

export function useFaq() {
  return useQuery<FaqItem[]>({
    queryKey: FAQ_KEY,
    queryFn: async () => {
      const res = await api<{ items: FaqItem[] }>('/public/faq');
      return res.items;
    },
    staleTime: 5 * 60_000,
  });
}

export function useGalleryAlbums() {
  return useQuery<GalleryAlbumLite[]>({
    queryKey: GALLERY_KEY,
    queryFn: async () => {
      const res = await api<{ items: GalleryAlbumLite[] }>('/public/gallery');
      return res.items;
    },
    staleTime: 5 * 60_000,
  });
}

export function useGalleryAlbum(slug: string | undefined) {
  return useQuery<GalleryAlbumDetail>({
    queryKey: slug ? galleryAlbumKey(slug) : ([...GALLERY_KEY, '__none__'] as const),
    queryFn: () => api<GalleryAlbumDetail>(`/public/gallery/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export const faqQueryKey = FAQ_KEY;
export const galleryQueryKey = GALLERY_KEY;
