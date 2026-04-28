import type { FastifyReply, FastifyRequest } from 'fastify';
import { reportsService } from '../reports/service.ts';
import { recordCashPaymentSchema } from './schemas.ts';
import { FinanceError, financeService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

const ERROR_TO_STATUS: Record<FinanceError['code'], number> = {
  NOT_FOUND: 404,
  NOT_OWNED: 403,
  OVERPAID: 400,
  INVOICE_CANCELED: 400,
};

function sendError(reply: FastifyReply, e: FinanceError) {
  reply.code(ERROR_TO_STATUS[e.code] ?? 400).send({ error: e.code, message: e.message });
}

function requirePerson(req: FastifyRequest, reply: FastifyReply): string | null {
  if (!req.user?.personId) {
    reply.code(401).send({ error: 'UNAUTHORIZED' });
    return null;
  }
  return req.user.personId;
}

function requireAdmin(req: FastifyRequest, reply: FastifyReply): boolean {
  if (!req.user) {
    reply.code(401).send({ error: 'UNAUTHORIZED' });
    return false;
  }
  if (req.user.role === 'participante') {
    reply.code(403).send({ error: 'FORBIDDEN' });
    return false;
  }
  return true;
}

export const financeController = {
  async listInvoices(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await financeService.listAll(req.server.db);
    return { items };
  },

  async listPayments(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await reportsService.listPayments(req.server.db);
    return { items };
  },

  async listRefunds(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await reportsService.listRefunds(req.server.db);
    return { items };
  },
  createAsaasCharge: notImplemented,

  async recordCashPayment(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = recordCashPaymentSchema.parse(req.body);
    try {
      const created = await financeService.recordPayment(req.server.db, id, parsed, req.user!.id);
      reply.code(201);
      return created;
    } catch (e) {
      if (e instanceof FinanceError) return sendError(reply, e);
      throw e;
    }
  },

  refundPayment: notImplemented,

  async getInvoiceById(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      return await financeService.getDetailAdmin(req.server.db, id);
    } catch (e) {
      if (e instanceof FinanceError) return sendError(reply, e);
      throw e;
    }
  },

  async deletePayment(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await financeService.deletePayment(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof FinanceError) return sendError(reply, e);
      throw e;
    }
  },

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

  async cashflowReport(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    return reportsService.financeReport(req.server.db);
  },

  async byEventReport(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await reportsService.participantsByEvent(req.server.db);
    return { items };
  },
};
