import type { FastifyPluginAsync } from 'fastify';
import { personsController } from './controller.ts';

export const personsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { schema: { tags: ['persons'] } }, personsController.list);
  app.post('/', { schema: { tags: ['persons'] } }, personsController.create);
  app.get('/:id', { schema: { tags: ['persons'] } }, personsController.getById);
  app.patch('/:id', { schema: { tags: ['persons'] } }, personsController.update);
  app.delete('/:id', { schema: { tags: ['persons'] } }, personsController.softDelete);
  // GET /v1/persons/:id/full-profile  (use 'me' como id para pegar o próprio)
  app.get(
    '/:id/full-profile',
    { schema: { tags: ['persons'] } },
    personsController.fullProfile,
  );
  // POST /v1/persons/:id/avatar  (multipart, use 'me' como id)
  app.post(
    '/:id/avatar',
    { schema: { tags: ['persons'] } },
    personsController.updateAvatar,
  );
  // POST /v1/persons/:id/role — admin promove/rebaixa
  app.post(
    '/:id/role',
    { schema: { tags: ['persons'] } },
    personsController.updateRole,
  );
};
