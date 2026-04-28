import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export type ShopProduct = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  photos: Array<{ url: string; alt: string | null }> | null;
  category: string | null;
  active: boolean;
  sortOrder: number;
  whatsappMessageTemplate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShopProductInput = {
  name: string;
  description?: string | null;
  price: string;
  photos?: Array<{ url: string; alt?: string | null }>;
  category?: string | null;
  active?: boolean;
  sortOrder?: number;
  whatsappMessageTemplate?: string | null;
};

const SHOP_KEY = ['admin', 'shop'] as const;

export function useAdminShopProducts() {
  return useQuery<ShopProduct[]>({
    queryKey: SHOP_KEY,
    queryFn: async () => {
      const res = await api<{ items: ShopProduct[] }>('/v1/shop');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useCreateShopProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ShopProductInput) =>
      api<ShopProduct>('/v1/shop', { method: 'POST', json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHOP_KEY });
    },
  });
}

export function useUpdateShopProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<ShopProductInput>;
    }) =>
      api<ShopProduct>(`/v1/shop/${id}`, { method: 'PATCH', json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHOP_KEY });
    },
  });
}

export function useDeleteShopProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/v1/shop/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHOP_KEY });
    },
  });
}
