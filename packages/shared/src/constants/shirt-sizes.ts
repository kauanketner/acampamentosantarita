export const SHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG'] as const;
export type ShirtSize = (typeof SHIRT_SIZES)[number];

// Tabela oficial do acampamento — em centímetros.
export const SHIRT_MEASUREMENTS: Record<
  ShirtSize,
  { chest: string; waist: string; length: number }
> = {
  PP: { chest: '86–90', waist: '72–76', length: 64 },
  P: { chest: '90–95', waist: '76–82', length: 66 },
  M: { chest: '95–100', waist: '82–88', length: 68 },
  G: { chest: '100–106', waist: '88–96', length: 70 },
  GG: { chest: '106–114', waist: '96–104', length: 72 },
  XGG: { chest: '114–122', waist: '104–112', length: 74 },
};
