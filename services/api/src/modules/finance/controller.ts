import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const financeController = {
  listInvoices: notImplemented,
  listPayments: notImplemented,
  listRefunds: notImplemented,
  // gera cobrança no Asaas (PIX/cartão/boleto) e atualiza invoice.asaas_*
  createAsaasCharge: notImplemented,
  // admin registra pagamento em dinheiro
  recordCashPayment: notImplemented,
  // estorno via Asaas (quando aplicável) ou manual
  refundPayment: notImplemented,
  listMyInvoices: notImplemented,
  cashflowReport: notImplemented,
  byEventReport: notImplemented,
};
