import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { profileQueryKey } from './profile';

export type DisabilityType = 'fisica' | 'visual' | 'auditiva' | 'intelectual';

export type HealthProfile = {
  id: string;
  personId: string;
  hasChronicDisease: boolean;
  chronicDiseaseDetail: string | null;
  hadSurgery: boolean;
  surgeryDetail: string | null;
  hasSenseDisability: boolean;
  senseDisabilityDetail: string | null;
  hasDisability: boolean;
  disabilityType: DisabilityType | null;
  hasAllergy: boolean;
  allergyDetail: string | null;
  hasAsthma: boolean;
  usesInhaler: boolean;
  hasDiabetes: boolean;
  insulinDependent: boolean;
  hasSleepwalking: boolean;
  hasHypertension: boolean;
  hasAddiction: boolean;
  addictionDetail: string | null;
  hasDietaryRestriction: boolean;
  dietaryRestrictionDetail: string | null;
  hasHealthInsurance: boolean;
  healthInsuranceName: string | null;
  healthInsuranceHolder: string | null;
  painMedications: string | null;
  vaccineCovid: boolean;
  vaccineFlu: boolean;
  vaccineYellowFever: boolean;
  medicalRestrictions: string | null;
  continuousMedications: string | null;
  generalObservations: string | null;
  lastReviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HealthUpsertInput = Partial<
  Omit<HealthProfile, 'id' | 'personId' | 'lastReviewedAt' | 'createdAt' | 'updatedAt'>
>;

const HEALTH_KEY = ['health', 'me'] as const;

export function useHealth() {
  return useQuery<HealthProfile | null>({
    queryKey: HEALTH_KEY,
    queryFn: () => api<HealthProfile | null>('/v1/health/me'),
    staleTime: 30_000,
  });
}

export function useUpdateHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: HealthUpsertInput) =>
      api<HealthProfile>('/v1/health/me', {
        method: 'PUT',
        json: input,
      }),
    onSuccess: (data) => {
      qc.setQueryData(HEALTH_KEY, data);
      qc.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}

export const healthQueryKey = HEALTH_KEY;
