import type { FastifyError, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

const plugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Payload inválido',
        details: error.flatten(),
      });
    }
    const fe = error as FastifyError;
    if (fe.statusCode && fe.statusCode < 500) {
      return reply.code(fe.statusCode).send({
        error: fe.code ?? 'CLIENT_ERROR',
        message: fe.message,
      });
    }
    app.log.error(error);
    return reply.code(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno do servidor',
    });
  });

  app.setNotFoundHandler((_req, reply) => {
    return reply.code(404).send({ error: 'NOT_FOUND', message: 'Rota não encontrada' });
  });
};

export const errorHandlerPlugin = fp(plugin, { name: 'error-handler' });
