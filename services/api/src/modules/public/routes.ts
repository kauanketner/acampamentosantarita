import type { FastifyPluginAsync } from 'fastify';
import { publicController } from './controller.ts';

export const publicRoutes: FastifyPluginAsync = async (app) => {
  app.get('/pages/:slug', { schema: { tags: ['public'] } }, publicController.getPage);
  app.get('/posts', { schema: { tags: ['public'] } }, publicController.listPosts);
  app.get('/posts/:slug', { schema: { tags: ['public'] } }, publicController.getPost);

  app.get('/home-blocks', { schema: { tags: ['public'] } }, publicController.listHomeBlocks);
  app.get('/gallery', { schema: { tags: ['public'] } }, publicController.listAlbums);
  app.get('/gallery/:slug', { schema: { tags: ['public'] } }, publicController.getAlbum);

  app.get('/faq', { schema: { tags: ['public'] } }, publicController.listFaq);
  app.get('/shop-products', { schema: { tags: ['public'] } }, publicController.listShopProducts);

  app.get(
    '/upcoming-events',
    { schema: { tags: ['public'] } },
    publicController.listUpcomingEvents,
  );
  app.get('/event/:slug', { schema: { tags: ['public'] } }, publicController.getEvent);

  app.post('/contact', { schema: { tags: ['public'] } }, publicController.submitContact);
};
