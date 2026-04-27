import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const webhooksController = {
  // POST /webhooks/asaas — eventos: PAYMENT_RECEIVED, PAYMENT_REFUNDED, PAYMENT_OVERDUE...
  // Validar token via header (ASAAS_WEBHOOK_TOKEN).
  asaas: notImplemented,
};
