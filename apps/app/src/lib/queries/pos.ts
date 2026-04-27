import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export type PosAccountStatus = 'aberta' | 'fechada' | 'paga';
export type PosCategory = 'cantina' | 'lojinha' | 'outros';

export type PosTransaction = {
  id: string;
  posAccountId: string;
  posItemId: string | null;
  itemName: string;
  quantity: number;
  unitPrice: string;
  total: string;
  recordedByUserId: string | null;
  notes: string | null;
  createdAt: string;
};

export type PosAccount = {
  id: string;
  personId: string;
  eventId: string;
  status: PosAccountStatus;
  openedAt: string;
  closedAt: string | null;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
  };
  transactions: PosTransaction[];
};

const POS_KEY = ['pos', 'me'] as const;

export function useMyPosAccount() {
  return useQuery<PosAccount | null>({
    queryKey: POS_KEY,
    queryFn: () => api<PosAccount | null>('/v1/pos/me/account'),
    staleTime: 30_000,
  });
}

export const posQueryKey = POS_KEY;
