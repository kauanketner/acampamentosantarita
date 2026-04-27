export const SACRAMENTS = [
  'batismo',
  'eucaristia',
  'crisma',
  'matrimonio',
  'ordem',
  'uncao_enfermos',
  'confissao',
] as const;
export type Sacrament = (typeof SACRAMENTS)[number];
