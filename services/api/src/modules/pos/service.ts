// TODO:
// - openAccount: cria conta com status='aberta'. Bloqueia se já houver conta aberta para
//   a pessoa naquele evento.
// - addTransaction: copia nome/preço do item (snapshot), recalcula totalAmount.
// - closeAccount: status='fechada', cria invoice (type='pos', referenceId=accountId).
//   Pessoa pode pagar parcial via Asaas a qualquer momento.

export const posService = {};
