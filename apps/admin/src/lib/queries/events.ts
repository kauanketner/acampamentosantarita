import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export type EventType = 'acampamento' | 'retiro' | 'encontro' | 'formacao' | 'outro';

export type EventStatus =
  | 'rascunho'
  | 'inscricoes_abertas'
  | 'inscricoes_fechadas'
  | 'em_andamento'
  | 'finalizado'
  | 'cancelado';

export type CustomQuestionType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multi_select'
  | 'bool'
  | 'number'
  | 'date';

export type CustomQuestionAudience = 'campista' | 'equipista' | 'ambos';

export type CustomQuestion = {
  id: string;
  eventId: string;
  question: string;
  type: CustomQuestionType;
  options: { options?: Array<{ value: string; label: string }> } | null;
  required: boolean;
  order: number;
  appliesTo: CustomQuestionAudience;
  createdAt: string;
  updatedAt: string;
};

export type AdminEventBase = {
  id: string;
  name: string;
  slug: string;
  type: EventType;
  editionNumber: number | null;
  startDate: string;
  endDate: string;
  location: string | null;
  description: string | null;
  coverImageUrl: string | null;
  status: EventStatus;
  maxParticipants: number | null;
  allowFirstTimer: boolean;
  isPaid: boolean;
  priceCampista: string | null;
  priceEquipista: string | null;
  registrationDeadline: string | null;
  allowRegistrationViaApp: boolean;
  allowRegistrationViaSite: boolean;
  requiresAdminApproval: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminEvent = AdminEventBase & {
  registrationCount: number;
  approvedCount: number;
  pendingCount: number;
};

export type EventInput = {
  name: string;
  slug: string;
  type: EventType;
  editionNumber?: number | null;
  startDate: string;
  endDate: string;
  location?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  status?: EventStatus;
  maxParticipants?: number | null;
  allowFirstTimer?: boolean;
  isPaid?: boolean;
  priceCampista?: string | null;
  priceEquipista?: string | null;
  registrationDeadline?: string | null;
  allowRegistrationViaApp?: boolean;
  allowRegistrationViaSite?: boolean;
  requiresAdminApproval?: boolean;
};

export type CustomQuestionInput = {
  question: string;
  type: CustomQuestionType;
  options?: { options: Array<{ value: string; label: string }> } | null;
  required?: boolean;
  order?: number;
  appliesTo?: CustomQuestionAudience;
};

const EVENTS_KEY = ['admin', 'events'] as const;
const eventByIdKey = (id: string) => [...EVENTS_KEY, 'by-id', id] as const;
const customQuestionsKey = (eventId: string) =>
  [...EVENTS_KEY, eventId, 'custom-questions'] as const;

export function useAdminEvents() {
  return useQuery<AdminEvent[]>({
    queryKey: EVENTS_KEY,
    queryFn: async () => {
      const res = await api<{ items: AdminEvent[] }>('/v1/events');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useAdminEvent(id: string | undefined) {
  return useQuery<AdminEventBase>({
    queryKey: id ? eventByIdKey(id) : ([...EVENTS_KEY, 'by-id', '__none__'] as const),
    queryFn: () => api<AdminEventBase>(`/v1/events/${id}`),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: EventInput) =>
      api<AdminEventBase>('/v1/events', { method: 'POST', json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EVENTS_KEY });
    },
  });
}

export function useUpdateEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<EventInput>) =>
      api<AdminEventBase>(`/v1/events/${id}`, {
        method: 'PATCH',
        json: input,
      }),
    onSuccess: (data) => {
      qc.setQueryData(eventByIdKey(id), data);
      qc.invalidateQueries({ queryKey: EVENTS_KEY });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/v1/events/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EVENTS_KEY });
    },
  });
}

export function useCustomQuestions(eventId: string | undefined) {
  return useQuery<CustomQuestion[]>({
    queryKey: eventId
      ? customQuestionsKey(eventId)
      : ([...EVENTS_KEY, '__none__', 'custom-questions'] as const),
    queryFn: async () => {
      const res = await api<{ items: CustomQuestion[] }>(`/v1/events/${eventId}/custom-questions`);
      return res.items;
    },
    enabled: !!eventId,
    staleTime: 30_000,
  });
}

export function useAddCustomQuestion(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CustomQuestionInput) =>
      api<CustomQuestion>(`/v1/events/${eventId}/custom-questions`, {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customQuestionsKey(eventId) });
    },
  });
}

export function useUpdateCustomQuestion(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CustomQuestionInput> }) =>
      api<CustomQuestion>(`/v1/events/custom-questions/${id}`, {
        method: 'PATCH',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customQuestionsKey(eventId) });
    },
  });
}

export function useDeleteCustomQuestion(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/v1/events/custom-questions/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customQuestionsKey(eventId) });
    },
  });
}

export const adminEventsQueryKey = EVENTS_KEY;
