import { type Database, getDb } from '@santarita/db';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../env.ts';

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  const db = getDb(env.DATABASE_URL);
  app.decorate('db', db);
};

export const dbPlugin = fp(plugin, { name: 'db' });
