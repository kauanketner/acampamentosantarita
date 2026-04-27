import { useQuery } from '@tanstack/react-query';
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

export type CustomQuestionOption = { value: string; label: string };

export type CustomQuestion = {
  id: string;
  eventId: string;
  question: string;
  type: CustomQuestionType;
  options: { options?: CustomQuestionOption[] } | null;
  required: boolean;
  order: number;
  appliesTo: CustomQuestionAudience;
  createdAt: string;
  updatedAt: string;
};

export type AppEvent = {
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

const EVENTS_KEY = ['events'] as const;
const eventBySlugKey = (slug: string) => [...EVENTS_KEY, 'by-slug', slug] as const;
const customQuestionsKey = (eventId: string) =>
  [...EVENTS_KEY, eventId, 'custom-questions'] as const;

export function useUpcomingEvents() {
  return useQuery<AppEvent[]>({
    queryKey: [...EVENTS_KEY, 'upcoming'] as const,
    queryFn: async () => {
      const res = await api<{ items: AppEvent[] }>('/public/upcoming-events');
      return res.items;
    },
    staleTime: 60_000,
  });
}

export function useEventBySlug(slug: string | undefined) {
  return useQuery<AppEvent>({
    queryKey: slug ? eventBySlugKey(slug) : ([...EVENTS_KEY, 'by-slug', '__none__'] as const),
    queryFn: () => api<AppEvent>(`/public/event/${slug}`),
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function useEventCustomQuestions(eventId: string | undefined) {
  return useQuery<CustomQuestion[]>({
    queryKey: eventId
      ? customQuestionsKey(eventId)
      : ([...EVENTS_KEY, '__none__', 'custom-questions'] as const),
    queryFn: async () => {
      const res = await api<{ items: CustomQuestion[] }>(
        `/v1/events/${eventId}/custom-questions`,
      );
      return res.items;
    },
    enabled: !!eventId,
    staleTime: 60_000,
  });
}

export const eventsQueryKey = EVENTS_KEY;
