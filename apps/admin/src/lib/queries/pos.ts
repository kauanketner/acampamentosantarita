import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export type PosCategory = 'cantina' | 'lojinha' | 'outros';
export type PosAccountStatus = 'aberta' | 'fechada' | 'paga';

export type PosItem = {
  id: string;
  name: string;
  sku: string | null;
  category: PosCategory;
  price: string;
  active: boolean;
  stock: number | null;
  createdAt: string;
  updatedAt: string;
};

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

export type PosAccountRow = {
  id: string;
  personId: string;
  eventId: string;
  status: PosAccountStatus;
  openedAt: string;
  closedAt: string | null;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  person: {
    id: string;
    fullName: string;
    mobilePhone: string | null;
    avatarUrl: string | null;
  };
  event: { id: string; name: string; startDate: string };
};

export type PosAccountDetail = PosAccountRow & {
  transactions: PosTransaction[];
};

export type PosItemInput = {
  name: string;
  sku?: string | null;
  category: PosCategory;
  price: string;
  active?: boolean;
  stock?: number | null;
};

export type OpenAccountInput = {
  personId: string;
  eventId: string;
};

export type AddTransactionInput = {
  posItemId?: string | null;
  itemName: string;
  quantity: number;
  unitPrice: string;
  notes?: string | null;
};

const POS_KEY = ['admin', 'pos'] as const;
const itemsKey = [...POS_KEY, 'items'] as const;
const accountsKey = (params: { eventId?: string; status?: string }) =>
  [...POS_KEY, 'accounts', params] as const;
const accountKey = (id: string) => [...POS_KEY, 'account', id] as const;

export function usePosItems() {
  return useQuery<PosItem[]>({
    queryKey: itemsKey,
    queryFn: async () => {
      const res = await api<{ items: PosItem[] }>('/v1/pos/items');
      return res.items;
    },
    staleTime: 60_000,
  });
}

export function usePosAccounts(
  params: {
    eventId?: string;
    status?: PosAccountStatus;
  } = {},
) {
  return useQuery<PosAccountRow[]>({
    queryKey: accountsKey(params),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.eventId) qs.set('eventId', params.eventId);
      if (params.status) qs.set('status', params.status);
      const url = `/v1/pos/accounts${qs.toString() ? `?${qs}` : ''}`;
      const res = await api<{ items: PosAccountRow[] }>(url);
      return res.items;
    },
    staleTime: 15_000,
  });
}

export function usePosAccount(id: string | undefined) {
  return useQuery<PosAccountDetail>({
    queryKey: id ? accountKey(id) : ([...POS_KEY, 'account', '__none__'] as const),
    queryFn: () => api<PosAccountDetail>(`/v1/pos/accounts/${id}`),
    enabled: !!id,
    staleTime: 10_000,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: POS_KEY });
}

export function useCreatePosItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PosItemInput) =>
      api<PosItem>('/v1/pos/items', { method: 'POST', json: input }),
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdatePosItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<PosItemInput> }) =>
      api<PosItem>(`/v1/pos/items/${id}`, { method: 'PATCH', json: input }),
    onSuccess: () => invalidate(qc),
  });
}

export function useDeletePosItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/v1/pos/items/${id}`, { method: 'DELETE' }),
    onSuccess: () => invalidate(qc),
  });
}

export function useOpenPosAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: OpenAccountInput) =>
      api<PosAccountRow>('/v1/pos/accounts/open', {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => invalidate(qc),
  });
}

export function useClosePosAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<PosAccountRow>(`/v1/pos/accounts/${id}/close`, {
        method: 'POST',
        json: {},
      }),
    onSuccess: () => invalidate(qc),
  });
}

export function useAddPosTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      input,
    }: {
      accountId: string;
      input: AddTransactionInput;
    }) =>
      api<PosTransaction>(`/v1/pos/accounts/${accountId}/transactions`, {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => invalidate(qc),
  });
}

export function useDeletePosTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/v1/pos/transactions/${id}`, { method: 'DELETE' }),
    onSuccess: () => invalidate(qc),
  });
}

export const adminPosQueryKey = POS_KEY;
