// TODO: integrar Better Auth (signup/signin/session).
// Diferenciar 2 fluxos de registro:
//   - registerFirstTimer: cria user + person sem nenhum camp_participation
//   - registerVeteran: cria user + person + N camp_participations com is_legacy=true,
//     onde o veterano informa edição (1..13), papel (campista/equipista/líder),
//     tribo legada (texto livre se não cadastrada) e função (texto livre).

export const authService = {};
