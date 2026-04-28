import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import type { AppEvent, CustomQuestionType } from './events';

export type RegistrationRoleIntent = 'campista' | 'equipista';

export type RegistrationStatus =
  | 'pendente'
  | 'aprovada'
  | 'rejeitada'
  | 'em_espera'
  | 'confirmada'
  | 'cancelada';

export type RegistrationPaymentStatus = 'isento' | 'pendente' | 'pago' | 'parcial' | 'reembolsado';

export type Registration = {
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
};

export type RegistrationListItem = Registration & {
  event: Pick<
    AppEvent,
    | 'id'
    | 'name'
    | 'slug'
    | 'type'
    | 'editionNumber'
    | 'startDate'
    | 'endDate'
    | 'location'
    | 'coverImageUrl'
    | 'status'
  >;
};

export type RegistrationAnswerRow = {
  id: string;
  customQuestionId: string;
  answer: unknown;
  question: string;
  type: CustomQuestionType;
};

export type RegistrationDetail = Registration & {
  event: AppEvent;
  answers: RegistrationAnswerRow[];
};

export type CreateRegistrationInput = {
  eventId: string;
  roleIntent: RegistrationRoleIntent;
  serviceTeamId?: string;
  customAnswers?: Array<{ customQuestionId: string; answer: unknown }>;
};

const REG_KEY = ['registrations'] as const;
const myRegsKey = [...REG_KEY, 'me'] as const;
const regByIdKey = (id: string) => [...REG_KEY, 'by-id', id] as const;

export function useMyRegistrations() {
  return useQuery<RegistrationListItem[]>({
    queryKey: myRegsKey,
    queryFn: async () => {
      const res = await api<{ items: RegistrationListItem[] }>('/v1/registrations/me');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useRegistration(id: string | undefined) {
  return useQuery<RegistrationDetail>({
    queryKey: id ? regByIdKey(id) : ([...REG_KEY, 'by-id', '__none__'] as const),
    queryFn: () => api<RegistrationDetail>(`/v1/registrations/${id}`),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRegistrationInput) =>
      api<Registration>('/v1/registrations', { method: 'POST', json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: myRegsKey });
    },
  });
}

export function useCancelRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api<Registration>(`/v1/registrations/${id}/cancel`, {
        method: 'POST',
        json: { reason },
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: myRegsKey });
      qc.invalidateQueries({ queryKey: regByIdKey(variables.id) });
    },
  });
}

export const registrationsQueryKey = REG_KEY;
