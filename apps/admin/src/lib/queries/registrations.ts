import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { adminEventsQueryKey } from './events';

export type RegistrationStatus =
  | 'pendente'
  | 'aprovada'
  | 'rejeitada'
  | 'em_espera'
  | 'confirmada'
  | 'cancelada';

export type RegistrationPaymentStatus = 'isento' | 'pendente' | 'pago' | 'parcial' | 'reembolsado';

export type RegistrationRoleIntent = 'campista' | 'equipista';

export type RegistrationPersonLite = {
  id: string;
  fullName: string;
  gender: 'masculino' | 'feminino' | null;
  birthDate: string | null;
  city: string | null;
  state: string | null;
  mobilePhone: string | null;
  avatarUrl: string | null;
  shirtSize: string | null;
};

export type EventRegistration = {
  id: string;
  eventId: string;
  personId: string;
  roleIntent: RegistrationRoleIntent;
  status: RegistrationStatus;
  tribeId: string | null;
  serviceTeamId: string | null;
  functionRole: string | null;
  paymentStatus: RegistrationPaymentStatus;
  priceAmount: string | null;
  registeredAt: string;
  approvedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  attended: boolean;
  createdAt: string;
  updatedAt: string;
  person: RegistrationPersonLite;
};

export type PendingRegistration = EventRegistration & {
  event: {
    id: string;
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
  };
};

const REG_KEY = ['admin', 'registrations'] as const;
const eventRegsKey = (eventId: string) => [...REG_KEY, 'by-event', eventId] as const;
const pendingKey = [...REG_KEY, 'pending'] as const;

export function useEventRegistrations(eventId: string | undefined) {
  return useQuery<EventRegistration[]>({
    queryKey: eventId ? eventRegsKey(eventId) : ([...REG_KEY, '__none__'] as const),
    queryFn: async () => {
      const res = await api<{ items: EventRegistration[] }>(`/v1/registrations/event/${eventId}`);
      return res.items;
    },
    enabled: !!eventId,
    staleTime: 15_000,
  });
}

export function usePendingRegistrations() {
  return useQuery<PendingRegistration[]>({
    queryKey: pendingKey,
    queryFn: async () => {
      const res = await api<{ items: PendingRegistration[] }>('/v1/registrations/pending');
      return res.items;
    },
    staleTime: 15_000,
  });
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: REG_KEY });
  qc.invalidateQueries({ queryKey: adminEventsQueryKey });
}

export function useApproveRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<EventRegistration>(`/v1/registrations/${id}/approve`, {
        method: 'POST',
        json: {},
      }),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useRejectRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api<EventRegistration>(`/v1/registrations/${id}/reject`, {
        method: 'POST',
        json: { reason },
      }),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useMarkAttended() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<EventRegistration>(`/v1/registrations/${id}/mark-attended`, {
        method: 'POST',
        json: {},
      }),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAdminCancelRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api<EventRegistration>(`/v1/registrations/${id}/cancel`, {
        method: 'POST',
        json: { reason },
      }),
    onSuccess: () => invalidateAll(qc),
  });
}

export const adminRegistrationsQueryKey = REG_KEY;
