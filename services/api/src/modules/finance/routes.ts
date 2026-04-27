import type { FastifyPluginAsync } from 'fastify';
import { financeController } from './controller.ts';

export const financeRoutes: FastifyPluginAsync = async (app) => {
  app.get('/invoices', { schema: { tags: ['finance'] } }, financeController.listInvoices);
  app.get(
    '/invoices/:id',
    { schema: { tags: ['finance'] } },
    financeController.getInvoiceById,
  );
  app.delete(
    '/payments/:id',
    { schema: { tags: ['finance'] } },
    financeController.deletePayment,
  );
  app.get('/payments', { schema: { tags: ['finance'] } }, financeController.listPayments);
  app.get('/refunds', { schema: { tags: ['finance'] } }, financeController.listRefunds);

  app.post(
    '/invoices/:id/asaas-charge',
    { schema: { tags: ['finance'] } },
    financeController.createAsaasCharge,
  );
  app.post(
    '/invoices/:id/record-cash',
    { schema: { tags: ['finance'] } },
    financeController.recordCashPayment,
  );
  app.post(
    '/payments/:id/refund',
    { schema: { tags: ['finance'] } },
    financeController.refundPayment,
  );

  // PWA — extrato pessoal
  app.get('/me/invoices', { schema: { tags: ['finance'] } }, financeController.listMyInvoices);
  app.get(
    '/me/invoices/:id',
    { schema: { tags: ['finance'] } },
    financeController.getMyInvoiceById,
  );

  // Relatórios
  app.get(
    '/reports/cashflow',
    { schema: { tags: ['finance'] } },
    financeController.cashflowReport,
  );
  app.get(
    '/reports/by-event',
    { schema: { tags: ['finance'] } },
    financeController.byEventReport,
  );
};
