export const MARITAL_STATUSES = [
  'solteiro',
  'casado',
  'divorciado',
  'viuvo',
  'uniao_estavel',
] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];
