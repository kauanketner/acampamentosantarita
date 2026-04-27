import type { FastifyReply, FastifyRequest } from 'fastify';
import { saveUpload } from '../../lib/storage.ts';
import { personsService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const personsController = {
  list: notImplemented,
  create: notImplemented,
  getById: notImplemented,
  update: notImplemented,
  softDelete: notImplemented,

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

    // Apenas o próprio user pode atualizar seu avatar (admin é uma fase posterior).
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
