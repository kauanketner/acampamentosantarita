import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export type AnnouncementInput = {
  eventId?: string | null;
  title: string;
  body: string;
  imageUrl?: string | null;
  targetAudience?: AnnouncementAudience;
  targetId?: string | null;
  sendPush?: boolean;
  publish?: boolean;
};

const ADMIN_ANNOUNCEMENTS_KEY = ['admin', 'announcements'] as const;

export function useAdminAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ADMIN_ANNOUNCEMENTS_KEY,
    queryFn: async () => {
      const res = await api<{ items: Announcement[] }>(
        '/v1/communication/announcements/admin',
      );
      return res.items;
    },
    staleTime: 15_000,
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AnnouncementInput) =>
      api<Announcement>('/v1/communication/announcements', {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEY });
    },
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<AnnouncementInput>;
    }) =>
      api<Announcement>(`/v1/communication/announcements/${id}`, {
        method: 'PATCH',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEY });
    },
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/v1/communication/announcements/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEY });
    },
  });
}

export const adminAnnouncementsQueryKey = ADMIN_ANNOUNCEMENTS_KEY;
