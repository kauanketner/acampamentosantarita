import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  addTransactionSchema,
  createPosItemSchema,
  openAccountSchema,
  updatePosItemSchema,
} from './schemas.ts';
import { PosError, posService } from './service.ts';

const ERROR_TO_STATUS: Record<PosError['code'], number> = {
  NOT_FOUND: 404,
  EVENT_NOT_FOUND: 404,
  PERSON_NOT_FOUND: 404,
  ALREADY_OPEN: 409,
  NOT_OPEN: 400,
  TRANSACTION_NOT_FOUND: 404,
};

function sendError(reply: FastifyReply, e: PosError) {
  reply
    .code(ERROR_TO_STATUS[e.code] ?? 400)
    .send({ error: e.code, message: e.message });
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

export const posController = {
  // ===== Items =====
  async listItems(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await posService.listItems(req.server.db);
    return { items };
  },

  async createItem(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createPosItemSchema.parse(req.body);
    const created = await posService.createItem(req.server.db, parsed);
    reply.code(201);
    return created;
  },

  async updateItem(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updatePosItemSchema.parse(req.body);
    try {
      return await posService.updateItem(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof PosError) return sendError(reply, e);
      throw e;
    }
  },

  async deleteItem(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    await posService.deleteItem(req.server.db, id);
    reply.code(204);
  },

  // ===== Accounts =====
  async listAccounts(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { eventId, status } = req.query as {
      eventId?: string;
      status?: 'aberta' | 'fechada' | 'paga';
    };
    const items = await posService.listAccounts(req.server.db, { eventId, status });
    return { items };
  },

  async openAccount(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = openAccountSchema.parse(req.body);
    try {
      const created = await posService.openAccount(req.server.db, parsed);
      reply.code(201);
      return created;
    } catch (e) {
      if (e instanceof PosError) return sendError(reply, e);
      throw e;
    }
  },

  async getAccount(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      return await posService.getAccountAdmin(req.server.db, id);
    } catch (e) {
      if (e instanceof PosError) return sendError(reply, e);
      throw e;
    }
  },

  async closeAccount(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      return await posService.closeAccount(req.server.db, id);
    } catch (e) {
      if (e instanceof PosError) return sendError(reply, e);
      throw e;
    }
  },

  async addTransaction(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = addTransactionSchema.parse(req.body);
    try {
      const created = await posService.addTransaction(
        req.server.db,
        id,
        parsed,
        req.user!.id,
      );
      reply.code(201);
      return created;
    } catch (e) {
      if (e instanceof PosError) return sendError(reply, e);
      throw e;
    }
  },

  async deleteTransaction(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await posService.deleteTransaction(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof PosError) return sendError(reply, e);
      throw e;
    }
  },

  async getMyAccount(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    return posService.getMyCurrentAccount(req.server.db, req.user.personId);
  },
};
