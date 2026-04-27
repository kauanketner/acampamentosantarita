import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const authController = {
  // POST /v1/auth/login — autentica e cria sessão (Better Auth)
  login: notImplemented,
  // POST /v1/auth/register-first-timer — cadastro 1ª vez (cria pessoa sem histórico legado)
  registerFirstTimer: notImplemented,
  // POST /v1/auth/register-veteran — cadastro de veterano (cria pessoa + entradas em camp_participations legadas)
  registerVeteran: notImplemented,
  // POST /v1/auth/logout
  logout: notImplemented,
  // POST /v1/auth/forgot-password
  forgotPassword: notImplemented,
  // POST /v1/auth/reset-password
  resetPassword: notImplemented,
  // GET /v1/auth/me — sessão atual + dados básicos da pessoa
  me: notImplemented,
};
