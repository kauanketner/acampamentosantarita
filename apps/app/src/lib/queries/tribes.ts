import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { EventStatus } from './events';

export type TribeMemberRole = 'lider' | 'vice_lider' | 'campista';

export type TribeEventLite = {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
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

export type TribeMember = {
  id: string;
  role: TribeMemberRole;
  person: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
};

export type CurrentTribePending = {
  revealed: false;
  event: TribeEventLite;
  myRole: TribeMemberRole;
};

export type CurrentTribeRevealed = {
  revealed: true;
  tribe: Tribe;
  event: TribeEventLite;
  myRole: TribeMemberRole;
  members: TribeMember[];
};

export type CurrentTribe = CurrentTribePending | CurrentTribeRevealed;

const TRIBE_KEY = ['tribe', 'me'] as const;

export function useCurrentTribe() {
  return useQuery<CurrentTribe | null>({
    queryKey: TRIBE_KEY,
    queryFn: () => api<CurrentTribe | null>('/v1/tribes/me/current'),
    staleTime: 60_000,
  });
}

export const tribeQueryKey = TRIBE_KEY;
