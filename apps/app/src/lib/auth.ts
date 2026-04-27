import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export type SessionPerson = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  city: string | null;
  state: string | null;
  shirtSize: string | null;
  mobilePhone: string | null;
} | null;

export type SessionPayload = {
  user: AuthUser;
  person: SessionPerson;
};

const ME_KEY = ['auth', 'me'] as const;

export function useSession() {
  return useQuery<SessionPayload | null>({
    queryKey: ME_KEY,
    queryFn: async () => {
      try {
        return await api<SessionPayload>('/v1/auth/me');
      } catch (err) {
        // 401 = não autenticado, retorna null sem propagar erro
        if (err instanceof Error && (err as { status?: number }).status === 401) {
          return null;
        }
        return null;
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      api<{ user: AuthUser }>('/v1/auth/login', { method: 'POST', json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ ok: true }>('/v1/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      qc.setQueryData(ME_KEY, null);
      qc.invalidateQueries();
    },
  });
}

export function useRegisterFirstTimer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) =>
      api<{ user: AuthUser }>('/v1/auth/register-first-timer', {
        method: 'POST',
        json: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useRegisterVeteran() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) =>
      api<{ user: AuthUser }>('/v1/auth/register-veteran', {
        method: 'POST',
        json: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export const authQueryKey = ME_KEY;
