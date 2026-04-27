import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

export type AdminRole =
  | 'admin'
  | 'equipe_acampamento'
  | 'tesouraria'
  | 'comunicacao'
  | 'participante';

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  role: AdminRole;
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
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}

export type RequestCodeResult = {
  phoneMasked: string;
  exists: boolean;
  expiresAt: string;
};

export function useRequestCode() {
  return useMutation({
    mutationFn: (input: { phone: string }) =>
      api<RequestCodeResult>('/v1/auth/request-code', {
        method: 'POST',
        json: input,
      }),
  });
}

export function useVerifyCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { phone: string; code: string }) =>
      api<{ user: AuthUser }>('/v1/auth/verify-code', {
        method: 'POST',
        json: input,
      }),
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

// Roles que têm acesso ao painel admin (qualquer um exceto participante).
export function isAdminRole(role: AdminRole | undefined | null): boolean {
  if (!role) return false;
  return role !== 'participante';
}

export function roleLabel(role: AdminRole): string {
  const map: Record<AdminRole, string> = {
    admin: 'Administrador(a)',
    equipe_acampamento: 'Equipe',
    tesouraria: 'Tesouraria',
    comunicacao: 'Comunicação',
    participante: 'Participante',
  };
  return map[role];
}

export const authQueryKey = ME_KEY;
