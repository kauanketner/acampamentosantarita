import type { FastifyReply, FastifyRequest } from 'fastify';
import { reportsService } from './service.ts';

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

export const reportsController = {
  async dashboard(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    return reportsService.dashboard(req.server.db);
  },

  async registrations(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    return reportsService.registrationsReport(req.server.db);
  },

  async finance(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    return reportsService.financeReport(req.server.db);
  },

  async participantsByEvent(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await reportsService.participantsByEvent(req.server.db);
    return { items };
  },

  async legacyHistory(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await reportsService.legacyHistory(req.server.db);
    return { items };
  },

  async audit(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await reportsService.listAuditLog(req.server.db);
    return { items };
  },
};
