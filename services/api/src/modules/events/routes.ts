import type { FastifyPluginAsync } from 'fastify';
import { eventsController } from './controller.ts';

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { schema: { tags: ['events'] } }, eventsController.list);
  app.post('/', { schema: { tags: ['events'] } }, eventsController.create);
  app.get('/:id', { schema: { tags: ['events'] } }, eventsController.getById);
  app.patch('/:id', { schema: { tags: ['events'] } }, eventsController.update);
  app.delete('/:id', { schema: { tags: ['events'] } }, eventsController.softDelete);

  app.post('/:id/duplicate', { schema: { tags: ['events'] } }, eventsController.duplicate);

  app.get(
    '/:id/registrations',
    { schema: { tags: ['events'] } },
    eventsController.listRegistrations,
  );
  app.get('/:id/tribes', { schema: { tags: ['events'] } }, eventsController.listTribes);
  app.get(
    '/:id/service-teams',
    { schema: { tags: ['events'] } },
    eventsController.listServiceTeams,
  );

  app.get(
    '/:id/custom-questions',
    { schema: { tags: ['events'] } },
    eventsController.listCustomQuestions,
  );
  app.post(
    '/:id/custom-questions',
    { schema: { tags: ['events'] } },
    eventsController.addCustomQuestion,
  );
  app.patch(
    '/custom-questions/:id',
    { schema: { tags: ['events'] } },
    eventsController.updateCustomQuestion,
  );
  app.delete(
    '/custom-questions/:id',
    { schema: { tags: ['events'] } },
    eventsController.deleteCustomQuestion,
  );
};
