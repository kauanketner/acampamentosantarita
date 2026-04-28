import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export type ServiceTeam = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ServiceTeamMember = {
  id: string;
  serviceTeamId: string;
  functionRole: string;
  confirmed: boolean;
  person: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    mobilePhone: string | null;
  };
};

export type ServiceTeamWithMembers = ServiceTeam & {
  members: ServiceTeamMember[];
};

export type ServiceTeamInput = {
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
};

export type AddAssignmentInput = {
  eventId: string;
  personId: string;
  functionRole?: string;
  confirmed?: boolean;
};

const TEAMS_KEY = ['admin', 'service-teams'] as const;
const eventTeamsKey = (eventId: string) =>
  [...TEAMS_KEY, 'by-event', eventId] as const;

export function useServiceTeams() {
  return useQuery<ServiceTeam[]>({
    queryKey: TEAMS_KEY,
    queryFn: async () => {
      const res = await api<{ items: ServiceTeam[] }>('/v1/service-teams');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useEventServiceTeams(eventId: string | undefined) {
  return useQuery<ServiceTeamWithMembers[]>({
    queryKey: eventId
      ? eventTeamsKey(eventId)
      : ([...TEAMS_KEY, '__none__'] as const),
    queryFn: async () => {
      const res = await api<{ items: ServiceTeamWithMembers[] }>(
        `/v1/events/${eventId}/service-teams`,
      );
      return res.items;
    },
    enabled: !!eventId,
    staleTime: 15_000,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: TEAMS_KEY });
}

export function useCreateServiceTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ServiceTeamInput) =>
      api<ServiceTeam>('/v1/service-teams', {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdateServiceTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ServiceTeamInput> }) =>
      api<ServiceTeam>(`/v1/service-teams/${id}`, {
        method: 'PATCH',
        json: input,
      }),
    onSuccess: () => invalidate(qc),
  });
}

export function useDeleteServiceTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/v1/service-teams/${id}`, { method: 'DELETE' }),
    onSuccess: () => invalidate(qc),
  });
}

export function useAddTeamAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      input,
    }: {
      teamId: string;
      input: AddAssignmentInput;
    }) =>
      api(`/v1/service-teams/${teamId}/assignments`, {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => invalidate(qc),
  });
}

export function useRemoveTeamAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      eventId,
      personId,
    }: {
      teamId: string;
      eventId: string;
      personId: string;
    }) =>
      api<void>(
        `/v1/service-teams/${teamId}/assignments/${personId}?eventId=${eventId}`,
        { method: 'DELETE' },
      ),
    onSuccess: () => invalidate(qc),
  });
}

export const adminServiceTeamsQueryKey = TEAMS_KEY;
