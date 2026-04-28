import type { FastifyPluginAsync } from 'fastify';
import { posController } from './controller.ts';

export const posRoutes: FastifyPluginAsync = async (app) => {
  app.get('/accounts', { schema: { tags: ['pos'] } }, posController.listAccounts);
  app.post('/accounts/open', { schema: { tags: ['pos'] } }, posController.openAccount);
  app.get('/accounts/:id', { schema: { tags: ['pos'] } }, posController.getAccount);
  app.post('/accounts/:id/close', { schema: { tags: ['pos'] } }, posController.closeAccount);
  app.post(
    '/accounts/:id/transactions',
    { schema: { tags: ['pos'] } },
    posController.addTransaction,
  );
  app.delete('/transactions/:id', { schema: { tags: ['pos'] } }, posController.deleteTransaction);

  app.get('/items', { schema: { tags: ['pos'] } }, posController.listItems);
  app.post('/items', { schema: { tags: ['pos'] } }, posController.createItem);
  app.patch('/items/:id', { schema: { tags: ['pos'] } }, posController.updateItem);
  app.delete('/items/:id', { schema: { tags: ['pos'] } }, posController.deleteItem);

  // PWA
  app.get('/me/account', { schema: { tags: ['pos'] } }, posController.getMyAccount);
};
