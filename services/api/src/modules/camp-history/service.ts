// TODO: regras:
// - addLegacy força is_legacy=true e bloqueia edição numérica >= 14 (eventos novos).
// - removeLegacy só apaga registros com is_legacy=true.
// - quando uma inscrição é confirmada num evento type=acampamento e edition_number,
//   um camp_participation com is_legacy=false é criado automaticamente.

export const campHistoryService = {};
