// TODO: regras críticas de inscrição:
// - bloquear inscrição como 'campista' em evento type='acampamento' se a pessoa já tem
//   participação anterior nesse acampamento ou se allow_first_timer=false.
// - exigir revisão de saúde (snapshot em registration_health_snapshots).
// - gerar invoice (type='registration') quando is_paid=true.
// - approve/reject + email + notificação push.
// - confirm: ao confirmar inscrição em evento numerado, criar camp_participation
//   com is_legacy=false.

export const registrationsService = {};
