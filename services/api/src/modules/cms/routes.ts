import type { FastifyPluginAsync } from 'fastify';
import { cmsController } from './controller.ts';

export const cmsRoutes: FastifyPluginAsync = async (app) => {
  // pages
  app.get('/pages', { schema: { tags: ['cms'] } }, cmsController.listPages);
  app.post('/pages', { schema: { tags: ['cms'] } }, cmsController.createPage);
  app.patch('/pages/:id', { schema: { tags: ['cms'] } }, cmsController.updatePage);
  app.delete('/pages/:id', { schema: { tags: ['cms'] } }, cmsController.deletePage);

  // posts
  app.get('/posts', { schema: { tags: ['cms'] } }, cmsController.listPosts);
  app.post('/posts', { schema: { tags: ['cms'] } }, cmsController.createPost);
  app.patch('/posts/:id', { schema: { tags: ['cms'] } }, cmsController.updatePost);
  app.delete('/posts/:id', { schema: { tags: ['cms'] } }, cmsController.deletePost);

  // gallery
  app.get('/gallery-albums', { schema: { tags: ['cms'] } }, cmsController.listAlbums);
  app.post('/gallery-albums', { schema: { tags: ['cms'] } }, cmsController.createAlbum);
  app.patch('/gallery-albums/:id', { schema: { tags: ['cms'] } }, cmsController.updateAlbum);
  app.delete('/gallery-albums/:id', { schema: { tags: ['cms'] } }, cmsController.deleteAlbum);
  app.post('/gallery-albums/:id/photos', { schema: { tags: ['cms'] } }, cmsController.addPhoto);
  app.delete('/gallery-photos/:id', { schema: { tags: ['cms'] } }, cmsController.deletePhoto);

  // home blocks
  app.get('/home-blocks', { schema: { tags: ['cms'] } }, cmsController.listHomeBlocks);
  app.post('/home-blocks', { schema: { tags: ['cms'] } }, cmsController.createHomeBlock);
  app.patch('/home-blocks/:id', { schema: { tags: ['cms'] } }, cmsController.updateHomeBlock);
  app.delete('/home-blocks/:id', { schema: { tags: ['cms'] } }, cmsController.deleteHomeBlock);

  // faq
  app.get('/faq', { schema: { tags: ['cms'] } }, cmsController.listFaq);
  app.post('/faq', { schema: { tags: ['cms'] } }, cmsController.createFaqItem);
  app.patch('/faq/:id', { schema: { tags: ['cms'] } }, cmsController.updateFaqItem);
  app.delete('/faq/:id', { schema: { tags: ['cms'] } }, cmsController.deleteFaqItem);
};
