export const USER_ROLES = [
  'admin',
  'equipe_acampamento',
  'tesouraria',
  'comunicacao',
  'participante',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PARTICIPATION_ROLES = ['campista', 'equipista', 'lider'] as const;
export type ParticipationRole = (typeof PARTICIPATION_ROLES)[number];

export const TRIBE_MEMBER_ROLES = ['lider', 'vice_lider', 'campista'] as const;
export type TribeMemberRole = (typeof TRIBE_MEMBER_ROLES)[number];

export const REGISTRATION_ROLE_INTENTS = ['campista', 'equipista'] as const;
export type RegistrationRoleIntent = (typeof REGISTRATION_ROLE_INTENTS)[number];
