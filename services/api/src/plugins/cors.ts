import cors from '@fastify/cors';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../env.ts';

const plugin: FastifyPluginAsync = async (app) => {
  await app.register(cors, {
    origin: [env.WEB_URL, env.ADMIN_URL, env.APP_URL],
    credentials: true,
  });
};

export const corsPlugin = fp(plugin, { name: 'cors' });
