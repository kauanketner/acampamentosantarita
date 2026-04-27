import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

// ===== FAQ =====

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

export type FaqInput = {
  question: string;
  answer: string;
  category?: string | null;
  sortOrder?: number;
  published?: boolean;
};

const FAQ_KEY = ['admin', 'cms', 'faq'] as const;

export function useAdminFaq() {
  return useQuery<FaqItem[]>({
    queryKey: FAQ_KEY,
    queryFn: async () => {
      const res = await api<{ items: FaqItem[] }>('/v1/cms/faq');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FaqInput) =>
      api<FaqItem>('/v1/cms/faq', { method: 'POST', json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FAQ_KEY });
    },
  });
}

export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<FaqInput> }) =>
      api<FaqItem>(`/v1/cms/faq/${id}`, { method: 'PATCH', json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FAQ_KEY });
    },
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/v1/cms/faq/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FAQ_KEY });
    },
  });
}

// ===== Gallery =====

export type GalleryAlbum = {
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

export type GalleryAlbumDetail = Omit<GalleryAlbum, 'photoCount'> & {
  photos: GalleryPhoto[];
};

export type GalleryAlbumInput = {
  name: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
  eventId?: string | null;
  published?: boolean;
  sortOrder?: number;
};

export type AddPhotoInput = {
  imageUrl: string;
  caption?: string | null;
  sortOrder?: number;
};

const GALLERY_KEY = ['admin', 'cms', 'gallery'] as const;

export function useAdminGalleryAlbums() {
  return useQuery<GalleryAlbum[]>({
    queryKey: GALLERY_KEY,
    queryFn: async () => {
      const res = await api<{ items: GalleryAlbum[] }>('/v1/cms/gallery-albums');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useAdminGalleryAlbum(slug: string | undefined) {
  // Detalhe agora vem da rota pública (mais rica). Quando o álbum é
  // não-publicado, o admin pode usar a lista pra obter id e depois usar
  // a rota detalhada por slug — mas a pública só retorna publicados.
  // Fallback: nada do detalhe quando não publicado.
  return useQuery<GalleryAlbumDetail>({
    queryKey: slug ? [...GALLERY_KEY, 'by-slug', slug] : ([...GALLERY_KEY, '__none__'] as const),
    queryFn: () => api<GalleryAlbumDetail>(`/public/gallery/${slug}`),
    enabled: !!slug,
    staleTime: 30_000,
  });
}

export function useCreateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: GalleryAlbumInput) =>
      api<GalleryAlbum>('/v1/cms/gallery-albums', {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY });
    },
  });
}

export function useUpdateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<GalleryAlbumInput>;
    }) =>
      api<GalleryAlbum>(`/v1/cms/gallery-albums/${id}`, {
        method: 'PATCH',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY });
    },
  });
}

export function useDeleteAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/v1/cms/gallery-albums/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY });
    },
  });
}

export function useAddGalleryPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      albumId,
      input,
    }: {
      albumId: string;
      input: AddPhotoInput;
    }) =>
      api<GalleryPhoto>(`/v1/cms/gallery-albums/${albumId}/photos`, {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY });
    },
  });
}

export function useDeleteGalleryPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/v1/cms/gallery-photos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY });
    },
  });
}

export const adminFaqQueryKey = FAQ_KEY;
export const adminGalleryQueryKey = GALLERY_KEY;
