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

export type AdminEvent = {
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
  registrationCount: number;
  approvedCount: number;
  pendingCount: number;
};

const EVENTS_KEY = ['admin', 'events'] as const;

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

export const adminEventsQueryKey = EVENTS_KEY;
