export const SHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'] as const;
export type ShirtSize = (typeof SHIRT_SIZES)[number];
