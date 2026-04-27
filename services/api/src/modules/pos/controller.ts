import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const posController = {
  // ?eventId= — admin filtra por evento atual
  listAccounts: notImplemented,
  openAccount: notImplemented,
  getAccount: notImplemented,
  // fecha conta e gera invoice em finance.invoices com saldo restante
  closeAccount: notImplemented,
  addTransaction: notImplemented,
  deleteTransaction: notImplemented,

  listItems: notImplemented,
  createItem: notImplemented,
  updateItem: notImplemented,
  deleteItem: notImplemented,

  // PWA: minha conta no evento atual (?eventId=)
  getMyAccount: notImplemented,
};
