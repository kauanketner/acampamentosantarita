import type { FastifyReply, FastifyRequest } from 'fastify';
import { saveUpload } from '../../lib/storage.ts';
import { personUpdateSchema } from './schemas.ts';
import { personsService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

function resolveTargetId(req: FastifyRequest): {
  ok: true;
  id: string;
} | {
  ok: false;
  status: number;
  error: string;
} {
  const { id } = req.params as { id: string };
  if (!req.user?.personId && id === 'me') {
    return { ok: false, status: 401, error: 'UNAUTHORIZED' };
  }
  const target = id === 'me' ? req.user!.personId! : id;
  if (target !== req.user?.personId && req.user?.role !== 'admin') {
    return { ok: false, status: 403, error: 'FORBIDDEN' };
  }
  return { ok: true, id: target };
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

export const personsController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { search } = req.query as { search?: string };
    const items = await personsService.listAdmin(req.server.db, { search });
    return { items };
  },

  create: notImplemented,

  async getById(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const data = await personsService.getByIdAdmin(req.server.db, id);
    if (!data) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return data;
  },

  softDelete: notImplemented,

  async update(req: FastifyRequest, reply: FastifyReply) {
    const target = resolveTargetId(req);
    if (!target.ok) {
      reply.code(target.status).send({ error: target.error });
      return;
    }
    const parsed = personUpdateSchema.parse(req.body);
    await personsService.updatePerson(req.server.db, target.id, parsed);
    const profile = await personsService.getFullProfile(req.server.db, target.id);
    return profile;
  },

  async fullProfile(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const targetId = id === 'me' ? req.user?.personId : id;
    if (!targetId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const data = await personsService.getFullProfile(req.server.db, targetId);
    if (!data) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return data;
  },

  async updateRole(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    if (req.user!.role !== 'admin') {
      reply
        .code(403)
        .send({ error: 'FORBIDDEN', message: 'Apenas admins podem alterar funções.' });
      return;
    }
    const { id } = req.params as { id: string };
    const { role } = (req.body as { role?: string } | undefined) ?? {};
    const validRoles = [
      'admin',
      'equipe_acampamento',
      'tesouraria',
      'comunicacao',
      'participante',
    ] as const;
    if (!role || !validRoles.includes(role as (typeof validRoles)[number])) {
      reply.code(400).send({ error: 'INVALID_ROLE' });
      return;
    }
    const updated = await personsService.updateUserRole(
      req.server.db,
      id,
      role as (typeof validRoles)[number],
    );
    if (!updated) {
      reply.code(404).send({
        error: 'USER_NOT_FOUND',
        message: 'Esta pessoa ainda não tem login no sistema.',
      });
      return;
    }
    return { ok: true };
  },

  async updateAvatar(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const { id } = req.params as { id: string };
    const targetId = id === 'me' ? req.user.personId : id;

    if (targetId !== req.user.personId && req.user.role !== 'admin') {
      reply.code(403).send({ error: 'FORBIDDEN' });
      return;
    }

    const file = await req.file();
    if (!file) {
      reply.code(400).send({ error: 'FILE_REQUIRED' });
      return;
    }
    if (!file.mimetype.startsWith('image/')) {
      reply.code(400).send({ error: 'INVALID_TYPE', message: 'Envie uma imagem.' });
      return;
    }
    const buffer = await file.toBuffer();
    const saved = await saveUpload(buffer, file.filename, `avatar-${targetId}`);
    await personsService.updateAvatar(req.server.db, targetId, saved.url);
    return { avatarUrl: saved.url };
  },
};
