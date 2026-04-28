import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export type AdminRole =
  | 'admin'
  | 'equipe_acampamento'
  | 'tesouraria'
  | 'comunicacao'
  | 'participante';

export type AdminPersonRow = {
  id: string;
  fullName: string;
  gender: 'masculino' | 'feminino' | null;
  birthDate: string | null;
  cpf: string | null;
  maritalStatus: string | null;
  heightCm: number | null;
  weightKg: string | null;
  shirtSize: string | null;
  avatarUrl: string | null;
  zipCode: string | null;
  street: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
  mobilePhone: string | null;
  profileCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; role: AdminRole; email: string | null } | null;
};

export type FullProfile = {
  person: AdminPersonRow;
  health: unknown | null;
  faith: unknown | null;
  contacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    order: number;
  }>;
  sacraments: string[];
  participations: Array<{
    id: string;
    campEdition: number;
    campYear: number | null;
    role: string;
    tribeNameLegacy: string | null;
    serviceTeam: string | null;
    functionRole: string | null;
    isLegacy: boolean;
  }>;
};

const PERSONS_KEY = ['admin', 'persons'] as const;
const personByIdKey = (id: string) => [...PERSONS_KEY, 'by-id', id] as const;
const personFullKey = (id: string) => [...PERSONS_KEY, 'full', id] as const;

export function useAdminPersons(search?: string) {
  return useQuery<AdminPersonRow[]>({
    queryKey: [...PERSONS_KEY, 'list', search ?? ''] as const,
    queryFn: async () => {
      const url = search
        ? `/v1/persons?search=${encodeURIComponent(search)}`
        : '/v1/persons';
      const res = await api<{ items: AdminPersonRow[] }>(url);
      return res.items;
    },
    staleTime: 15_000,
  });
}

export function useAdminPerson(id: string | undefined) {
  return useQuery<AdminPersonRow>({
    queryKey: id ? personByIdKey(id) : ([...PERSONS_KEY, 'by-id', '__none__'] as const),
    queryFn: () => api<AdminPersonRow>(`/v1/persons/${id}`),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useAdminPersonFull(id: string | undefined) {
  return useQuery<FullProfile>({
    queryKey: id ? personFullKey(id) : ([...PERSONS_KEY, 'full', '__none__'] as const),
    queryFn: () => api<FullProfile>(`/v1/persons/${id}/full-profile`),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export type UpdatePersonInput = {
  fullName?: string;
  cpf?: string | null;
  shirtSize?: string | null;
  city?: string | null;
  state?: string | null;
  mobilePhone?: string;
  zipCode?: string | null;
  street?: string | null;
  neighborhood?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
};

export function useUpdatePerson(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePersonInput) =>
      api<unknown>(`/v1/persons/${id}`, {
        method: 'PATCH',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PERSONS_KEY });
    },
  });
}

export function useUpdatePersonRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ personId, role }: { personId: string; role: AdminRole }) =>
      api<{ ok: true }>(`/v1/persons/${personId}/role`, {
        method: 'POST',
        json: { role },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PERSONS_KEY });
    },
  });
}

export const adminPersonsQueryKey = PERSONS_KEY;
