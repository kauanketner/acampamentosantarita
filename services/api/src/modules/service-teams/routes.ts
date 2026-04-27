import type { FastifyPluginAsync } from 'fastify';
import { serviceTeamsController } from './controller.ts';

export const serviceTeamsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { schema: { tags: ['service-teams'] } }, serviceTeamsController.list);
  app.post('/', { schema: { tags: ['service-teams'] } }, serviceTeamsController.create);
  app.patch('/:id', { schema: { tags: ['service-teams'] } }, serviceTeamsController.update);
  app.delete('/:id', { schema: { tags: ['service-teams'] } }, serviceTeamsController.delete);

  app.post(
    '/:id/assignments',
    { schema: { tags: ['service-teams'] } },
    serviceTeamsController.addAssignment,
  );
  app.delete(
    '/:id/assignments/:personId',
    { schema: { tags: ['service-teams'] } },
    serviceTeamsController.removeAssignment,
  );

  app.get(
    '/me/current',
    { schema: { tags: ['service-teams'] } },
    serviceTeamsController.getMyCurrent,
  );
};
