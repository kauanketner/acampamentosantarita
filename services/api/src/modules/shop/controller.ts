import type { FastifyReply, FastifyRequest } from 'fastify';
import { createShopProductSchema, updateShopProductSchema } from './schemas.ts';
import { ShopError, shopService } from './service.ts';

const ERROR_TO_STATUS: Record<ShopError['code'], number> = { NOT_FOUND: 404 };

function sendError(reply: FastifyReply, e: ShopError) {
  reply.code(ERROR_TO_STATUS[e.code] ?? 400).send({ error: e.code, message: e.message });
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

export const shopController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await shopService.listAll(req.server.db);
    return { items };
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createShopProductSchema.parse(req.body);
    const created = await shopService.create(req.server.db, parsed);
    reply.code(201);
    return created;
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateShopProductSchema.parse(req.body);
    try {
      return await shopService.update(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof ShopError) return sendError(reply, e);
      throw e;
    }
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    await shopService.delete(req.server.db, id);
    reply.code(204);
  },
};
