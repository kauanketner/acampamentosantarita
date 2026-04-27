import type { FastifyReply, FastifyRequest } from 'fastify';
import { posService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const posController = {
  listAccounts: notImplemented,
  openAccount: notImplemented,
  getAccount: notImplemented,
  closeAccount: notImplemented,
  addTransaction: notImplemented,
  deleteTransaction: notImplemented,

  listItems: notImplemented,
  createItem: notImplemented,
  updateItem: notImplemented,
  deleteItem: notImplemented,

  // GET /v1/pos/me/account — minha conta PDV mais recente, com transações.
  async getMyAccount(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const data = await posService.getMyCurrentAccount(
      req.server.db,
      req.user.personId,
    );
    return data; // pode ser null
  },
};
