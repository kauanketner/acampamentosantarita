export const GENDERS = ['masculino', 'feminino'] as const;
export type Gender = (typeof GENDERS)[number];
