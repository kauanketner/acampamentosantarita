export const POS_ITEM_CATEGORIES = ['cantina', 'lojinha', 'outros'] as const;
export type PosItemCategory = (typeof POS_ITEM_CATEGORIES)[number];

export const POS_ACCOUNT_STATUSES = ['aberta', 'fechada', 'paga'] as const;
export type PosAccountStatus = (typeof POS_ACCOUNT_STATUSES)[number];
