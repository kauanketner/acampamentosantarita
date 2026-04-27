import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import type { Sacrament } from './profile';
import { profileQueryKey } from './profile';

export type FaithProfile = {
  id: string;
  personId: string;
  religion: string | null;
  parish: string | null;
  groupName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FaithMe = {
  profile: FaithProfile | null;
  sacraments: Sacrament[];
};

export type FaithUpsertInput = {
  religion?: string | null;
  parish?: string | null;
  groupName?: string | null;
  sacraments: Sacrament[];
};

const FAITH_KEY = ['faith', 'me'] as const;

export function useFaith() {
  return useQuery<FaithMe>({
    queryKey: FAITH_KEY,
    queryFn: () => api<FaithMe>('/v1/faith/me'),
    staleTime: 30_000,
  });
}

export function useUpdateFaith() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FaithUpsertInput) =>
      api<FaithMe>('/v1/faith/me', {
        method: 'PUT',
        json: input,
      }),
    onSuccess: (data) => {
      qc.setQueryData(FAITH_KEY, data);
      qc.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}

export const faithQueryKey = FAITH_KEY;
