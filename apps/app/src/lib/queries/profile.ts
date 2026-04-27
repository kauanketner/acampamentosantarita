import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, api, apiUpload } from '../api';
import { authQueryKey } from '../auth';

export type Sacrament =
  | 'batismo'
  | 'eucaristia'
  | 'crisma'
  | 'matrimonio'
  | 'ordem'
  | 'uncao_enfermos'
  | 'confissao';

export type EmergencyContact = {
  id: string;
  personId: string;
  name: string;
  relationship: string;
  phone: string;
  order: number;
};

export type Person = {
  id: string;
  fullName: string;
  gender: 'masculino' | 'feminino' | null;
  birthDate: string | null;
  cpf: string | null;
  maritalStatus:
    | 'solteiro'
    | 'casado'
    | 'divorciado'
    | 'viuvo'
    | 'uniao_estavel'
    | null;
  heightCm: number | null;
  weightKg: string | null;
  shirtSize: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | null;
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
};

export type CampParticipation = {
  id: string;
  personId: string;
  campEdition: number;
  campYear: number | null;
  role: 'campista' | 'equipista' | 'lider';
  tribeNameLegacy: string | null;
  serviceTeam: string | null;
  functionRole: string | null;
  isLegacy: boolean;
  registrationId: string | null;
};

export type FullProfile = {
  person: Person;
  health: unknown | null;
  faith: unknown | null;
  contacts: EmergencyContact[];
  sacraments: Sacrament[];
  participations: CampParticipation[];
};

const PROFILE_KEY = ['profile', 'me'] as const;

export function useFullProfile() {
  return useQuery<FullProfile>({
    queryKey: PROFILE_KEY,
    queryFn: () => api<FullProfile>('/v1/persons/me/full-profile'),
    staleTime: 30_000,
  });
}

export type UpdateProfileInput = {
  fullName?: string;
  gender?: 'masculino' | 'feminino' | null;
  birthDate?: string | null;
  cpf?: string | null;
  maritalStatus?:
    | 'solteiro'
    | 'casado'
    | 'divorciado'
    | 'viuvo'
    | 'uniao_estavel'
    | null;
  heightCm?: number | null;
  weightKg?: number | null;
  shirtSize?: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | null;
  mobilePhone?: string;
  zipCode?: string | null;
  street?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
};

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      api<FullProfile>('/v1/persons/me', {
        method: 'PATCH',
        json: input,
      }),
    onSuccess: (data) => {
      qc.setQueryData(PROFILE_KEY, data);
      qc.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      apiUpload<{ avatarUrl: string }>(`/v1/persons/me/avatar`, file, 'file'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_KEY });
      qc.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export const profileQueryKey = PROFILE_KEY;
