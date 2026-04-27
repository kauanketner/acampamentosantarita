import rateLimit from '@fastify/rate-limit';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (app) => {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
};

export const rateLimitPlugin = fp(plugin, { name: 'rate-limit' });
