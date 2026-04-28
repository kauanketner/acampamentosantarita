import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export type AnnouncementAudience =
  | 'todos'
  | 'participantes_evento'
  | 'equipistas'
  | 'tribo_x'
  | 'equipe_x';

export type Announcement = {
  id: string;
  eventId: string | null;
  title: string;
  body: string;
  imageUrl: string | null;
  targetAudience: AnnouncementAudience;
  targetId: string | null;
  publishedAt: string | null;
  publishedByUserId: string | null;
  sendPush: boolean;
  createdAt: string;
  updatedAt: string;
  event: { id: string; name: string; slug: string } | null;
};

const ANNOUNCEMENTS_KEY = ['announcements'] as const;

export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ANNOUNCEMENTS_KEY,
    queryFn: async () => {
      const res = await api<{ items: Announcement[] }>('/v1/communication/announcements');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export const announcementsQueryKey = ANNOUNCEMENTS_KEY;
