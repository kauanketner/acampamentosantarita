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

export const personsController = {
  list: notImplemented,
  create: notImplemented,
  getById: notImplemented,
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
