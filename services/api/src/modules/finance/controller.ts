import type { FastifyReply, FastifyRequest } from 'fastify';
import { FinanceError, financeService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

const ERROR_TO_STATUS: Record<FinanceError['code'], number> = {
  NOT_FOUND: 404,
  NOT_OWNED: 403,
};

function sendError(reply: FastifyReply, e: FinanceError) {
  reply
    .code(ERROR_TO_STATUS[e.code] ?? 400)
    .send({ error: e.code, message: e.message });
}

function requirePerson(req: FastifyRequest, reply: FastifyReply): string | null {
  if (!req.user?.personId) {
    reply.code(401).send({ error: 'UNAUTHORIZED' });
    return null;
  }
  return req.user.personId;
}

export const financeController = {
  listInvoices: notImplemented,
  listPayments: notImplemented,
  listRefunds: notImplemented,
  createAsaasCharge: notImplemented,
  recordCashPayment: notImplemented,
  refundPayment: notImplemented,

  async listMyInvoices(req: FastifyRequest, reply: FastifyReply) {
    const personId = requirePerson(req, reply);
    if (!personId) return;
    const items = await financeService.listMine(req.server.db, personId);
    return { items };
  },

  async getMyInvoiceById(req: FastifyRequest, reply: FastifyReply) {
    const personId = requirePerson(req, reply);
    if (!personId) return;
    const { id } = req.params as { id: string };
    try {
      return await financeService.getMineDetail(req.server.db, personId, id);
    } catch (e) {
      if (e instanceof FinanceError) return sendError(reply, e);
      throw e;
    }
  },

  cashflowReport: notImplemented,
  byEventReport: notImplemented,
};
