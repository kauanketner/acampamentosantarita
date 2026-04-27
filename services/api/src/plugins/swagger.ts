import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

const plugin: FastifyPluginAsync = async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Acampamento Santa Rita API',
        description: 'API interna da plataforma Santa Rita.',
        version: '0.0.1',
      },
      servers: [
        { url: 'http://localhost:3333', description: 'dev' },
        { url: 'https://api.acampamentosantarita.com.br', description: 'prod' },
      ],
      tags: [
        { name: 'auth' },
        { name: 'persons' },
        { name: 'health' },
        { name: 'faith' },
        { name: 'camp-history' },
        { name: 'events' },
        { name: 'registrations' },
        { name: 'tribes' },
        { name: 'service-teams' },
        { name: 'finance' },
        { name: 'pos' },
        { name: 'shop' },
        { name: 'communication' },
        { name: 'cms' },
        { name: 'reports' },
        { name: 'webhooks' },
        { name: 'public' },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list' },
  });
};

export const swaggerPlugin = fp(plugin, { name: 'swagger' });
