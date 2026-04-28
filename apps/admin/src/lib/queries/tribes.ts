import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export type TribeMemberRole = 'lider' | 'vice_lider' | 'campista';

export type TribeMember = {
  id: string;
  tribeId: string;
  role: TribeMemberRole;
  isRevealedToMember: boolean;
  person: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    mobilePhone: string | null;
  };
};

export type Tribe = {
  id: string;
  eventId: string;
  name: string;
  color: string | null;
  motto: string | null;
  description: string | null;
  photoUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type TribeWithMembers = Tribe & {
  members: TribeMember[];
};

export type TribeInput = {
  eventId: string;
  name: string;
  color?: string | null;
  motto?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  sortOrder?: number;
};

export type UpdateTribeInput = Omit<Partial<TribeInput>, 'eventId'>;

export type AddMemberInput = {
  personId: string;
  role?: TribeMemberRole;
};

const TRIBES_KEY = ['admin', 'tribes'] as const;
const eventTribesKey = (eventId: string) => [...TRIBES_KEY, 'by-event', eventId] as const;
const tribeKey = (id: string) => [...TRIBES_KEY, 'by-id', id] as const;

export function useEventTribes(eventId: string | undefined) {
  return useQuery<TribeWithMembers[]>({
    queryKey: eventId ? eventTribesKey(eventId) : ([...TRIBES_KEY, '__none__'] as const),
    queryFn: async () => {
      const res = await api<{ items: TribeWithMembers[] }>(`/v1/events/${eventId}/tribes`);
      return res.items;
    },
    enabled: !!eventId,
    staleTime: 15_000,
  });
}

export function useTribe(id: string | undefined) {
  return useQuery<TribeWithMembers>({
    queryKey: id ? tribeKey(id) : ([...TRIBES_KEY, 'by-id', '__none__'] as const),
    queryFn: () => api<TribeWithMembers>(`/v1/tribes/${id}`),
    enabled: !!id,
    staleTime: 15_000,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, eventId?: string) {
  qc.invalidateQueries({ queryKey: TRIBES_KEY });
  if (eventId) qc.invalidateQueries({ queryKey: eventTribesKey(eventId) });
}

export function useCreateTribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TribeInput) => api<Tribe>('/v1/tribes', { method: 'POST', json: input }),
    onSuccess: (_data, vars) => invalidate(qc, vars.eventId),
  });
}

export function useUpdateTribe(eventId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTribeInput }) =>
      api<Tribe>(`/v1/tribes/${id}`, { method: 'PATCH', json: input }),
    onSuccess: () => invalidate(qc, eventId),
  });
}

export function useDeleteTribe(eventId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/v1/tribes/${id}`, { method: 'DELETE' }),
    onSuccess: () => invalidate(qc, eventId),
  });
}

export function useAddTribeMember(eventId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tribeId, input }: { tribeId: string; input: AddMemberInput }) =>
      api<TribeMember>(`/v1/tribes/${tribeId}/members`, {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => invalidate(qc, eventId),
  });
}

export function useRemoveTribeMember(eventId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tribeId, personId }: { tribeId: string; personId: string }) =>
      api<void>(`/v1/tribes/${tribeId}/members/${personId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => invalidate(qc, eventId),
  });
}

export function useRevealTribesForEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) =>
      api<{ revealed: number }>(`/v1/tribes/event/${eventId}/reveal-tribes`, {
        method: 'POST',
        json: {},
      }),
    onSuccess: (_data, eventId) => invalidate(qc, eventId),
  });
}

export const adminTribesQueryKey = TRIBES_KEY;
