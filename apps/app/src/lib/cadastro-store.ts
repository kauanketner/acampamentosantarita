import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Variant = 'primeira-vez' | 'veterano';

export type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

export type CampParticipationDraft = {
  id: string;
  campEdition: string;
  role: 'campista' | 'equipista' | 'lider' | '';
  tribeNameLegacy: string;
  serviceTeam: string;
  functionRole: string;
};

export type Health = {
  hasChronicDisease: boolean;
  chronicDiseaseDetail: string;
  hadSurgery: boolean;
  surgeryDetail: string;
  hasSenseDisability: boolean;
  senseDisabilityDetail: string;
  hasDisability: boolean;
  disabilityType: 'fisica' | 'visual' | 'auditiva' | 'intelectual' | '';
  hasAllergy: boolean;
  allergyDetail: string;
  hasAsthma: boolean;
  usesInhaler: boolean;
  hasDiabetes: boolean;
  insulinDependent: boolean;
  hasSleepwalking: boolean;
  hasHypertension: boolean;
  hasAddiction: boolean;
  addictionDetail: string;
  hasDietaryRestriction: boolean;
  dietaryRestrictionDetail: string;
  hasHealthInsurance: boolean;
  healthInsuranceName: string;
  healthInsuranceHolder: string;
  painMedications: string;
  vaccineCovid: boolean;
  vaccineFlu: boolean;
  vaccineYellowFever: boolean;
  medicalRestrictions: string;
  continuousMedications: string;
  generalObservations: string;
};

const emptyHealth: Health = {
  hasChronicDisease: false,
  chronicDiseaseDetail: '',
  hadSurgery: false,
  surgeryDetail: '',
  hasSenseDisability: false,
  senseDisabilityDetail: '',
  hasDisability: false,
  disabilityType: '',
  hasAllergy: false,
  allergyDetail: '',
  hasAsthma: false,
  usesInhaler: false,
  hasDiabetes: false,
  insulinDependent: false,
  hasSleepwalking: false,
  hasHypertension: false,
  hasAddiction: false,
  addictionDetail: '',
  hasDietaryRestriction: false,
  dietaryRestrictionDetail: '',
  hasHealthInsurance: false,
  healthInsuranceName: '',
  healthInsuranceHolder: '',
  painMedications: '',
  vaccineCovid: false,
  vaccineFlu: false,
  vaccineYellowFever: false,
  medicalRestrictions: '',
  continuousMedications: '',
  generalObservations: '',
};

export type CadastroState = {
  variant: Variant | null;

  // passo 1
  fullName: string;
  gender: 'masculino' | 'feminino' | '';
  birthDate: string; // yyyy-MM-dd
  cpf: string; // raw digits
  phone: string; // raw digits
  maritalStatus: 'solteiro' | 'casado' | 'uniao_estavel' | 'divorciado' | 'viuvo' | '';
  heightCm: string;
  weightKg: string;
  shirtSize: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | '';
  avatarFile: File | null;

  // passo 2
  zipCode: string;
  street: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  state: string;

  // passo 3
  emergencyContacts: EmergencyContact[];

  // passo 4
  religion: string;
  parish: string;
  groupName: string;
  sacraments: string[];

  // passo 5
  health: Health;

  // passo 6 (veterano)
  campParticipations: CampParticipationDraft[];

  setVariant: (v: Variant) => void;
  set: <K extends keyof CadastroState>(key: K, value: CadastroState[K]) => void;
  setHealth: (patch: Partial<Health>) => void;
  reset: () => void;
};

const initialState = {
  variant: null as Variant | null,
  fullName: '',
  gender: '' as CadastroState['gender'],
  birthDate: '',
  cpf: '',
  phone: '',
  maritalStatus: '' as CadastroState['maritalStatus'],
  heightCm: '',
  weightKg: '',
  shirtSize: '' as CadastroState['shirtSize'],
  avatarFile: null as File | null,
  zipCode: '',
  street: '',
  addressNumber: '',
  addressComplement: '',
  neighborhood: '',
  city: '',
  state: '',
  emergencyContacts: [
    { id: 'c1', name: '', relationship: '', phone: '' },
    { id: 'c2', name: '', relationship: '', phone: '' },
  ] as EmergencyContact[],
  religion: '',
  parish: '',
  groupName: '',
  sacraments: [] as string[],
  health: { ...emptyHealth },
  campParticipations: [
    {
      id: 'p1',
      campEdition: '',
      role: '' as CampParticipationDraft['role'],
      tribeNameLegacy: '',
      serviceTeam: '',
      functionRole: '',
    },
  ] as CampParticipationDraft[],
};

export const useCadastroStore = create<CadastroState>()(
  persist(
    (set) => ({
      ...initialState,
      setVariant: (variant) => set({ variant }),
      set: (key, value) => set({ [key]: value } as Partial<CadastroState>),
      setHealth: (patch) => set((s) => ({ health: { ...s.health, ...patch } })),
      reset: () => set(initialState),
    }),
    {
      name: 'santarita-cadastro',
      // File não é serializável — exclui do persist
      partialize: (state) => {
        const { avatarFile: _avatar, ...rest } = state;
        return rest;
      },
    },
  ),
);

export type SignupPayload = {
  email: string;
  password: string;
  person: {
    fullName: string;
    gender?: 'masculino' | 'feminino';
    birthDate?: string;
    cpf?: string;
    maritalStatus?: 'solteiro' | 'casado' | 'uniao_estavel' | 'divorciado' | 'viuvo';
    heightCm?: number;
    weightKg?: number;
    shirtSize?: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
    mobilePhone?: string;
    zipCode?: string;
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    addressNumber?: string;
    addressComplement?: string;
  };
  emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
  faith?: { religion?: string; parish?: string; groupName?: string; sacraments: string[] };
  health?: Health;
  campParticipations?: Array<{
    campEdition: number;
    role: 'campista' | 'equipista' | 'lider';
    tribeNameLegacy?: string;
    serviceTeam?: string;
    functionRole?: string;
  }>;
};

export function buildSignupPayload(
  state: CadastroState,
  email: string,
  password: string,
): SignupPayload {
  const trim = (s: string) => (s.trim() === '' ? undefined : s.trim());
  const num = (s: string) => {
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  return {
    email: email.trim().toLowerCase(),
    password,
    person: {
      fullName: state.fullName.trim(),
      gender: state.gender || undefined,
      birthDate: trim(state.birthDate),
      cpf: trim(state.cpf),
      maritalStatus: state.maritalStatus || undefined,
      heightCm: state.heightCm ? Number.parseInt(state.heightCm, 10) || undefined : undefined,
      weightKg: num(state.weightKg),
      shirtSize: state.shirtSize || undefined,
      mobilePhone: trim(state.phone),
      zipCode: trim(state.zipCode),
      street: trim(state.street),
      neighborhood: trim(state.neighborhood),
      city: trim(state.city),
      state: state.state ? state.state.toUpperCase() : undefined,
      addressNumber: trim(state.addressNumber),
      addressComplement: trim(state.addressComplement),
    },
    emergencyContacts: state.emergencyContacts
      .filter((c) => c.name && c.phone)
      .map((c) => ({ name: c.name, relationship: c.relationship || '—', phone: c.phone })),
    faith: {
      religion: trim(state.religion),
      parish: trim(state.parish),
      groupName: trim(state.groupName),
      sacraments: state.sacraments,
    },
    health: state.health,
    campParticipations: state.variant === 'veterano'
      ? state.campParticipations
          .filter((p) => p.campEdition && p.role)
          .map((p) => ({
            campEdition: Number.parseInt(p.campEdition, 10),
            role: p.role as 'campista' | 'equipista' | 'lider',
            tribeNameLegacy: trim(p.tribeNameLegacy),
            serviceTeam: trim(p.serviceTeam),
            functionRole: trim(p.functionRole),
          }))
      : undefined,
  };
}
