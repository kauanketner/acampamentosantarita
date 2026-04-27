export const DISABILITY_TYPES = ['fisica', 'visual', 'auditiva', 'intelectual'] as const;
export type DisabilityType = (typeof DISABILITY_TYPES)[number];
