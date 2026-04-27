import type { FastifyPluginAsync } from 'fastify';
import { tribesController } from './controller.ts';

export const tribesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', { schema: { tags: ['tribes'] } }, tribesController.create);
  app.get('/:id', { schema: { tags: ['tribes'] } }, tribesController.getById);
  app.patch('/:id', { schema: { tags: ['tribes'] } }, tribesController.update);
  app.delete('/:id', { schema: { tags: ['tribes'] } }, tribesController.delete);

  app.post('/:id/members', { schema: { tags: ['tribes'] } }, tribesController.addMember);
  app.delete(
    '/:id/members/:personId',
    { schema: { tags: ['tribes'] } },
    tribesController.removeMember,
  );

  app.post(
    '/event/:eventId/reveal-tribes',
    { schema: { tags: ['tribes'] } },
    tribesController.revealForEvent,
  );

  app.get('/me/current', { schema: { tags: ['tribes'] } }, tribesController.getMyCurrent);
};
