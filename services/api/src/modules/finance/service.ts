import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq, inArray, sum } from 'drizzle-orm';

export class FinanceError extends Error {
  constructor(public code: 'NOT_FOUND' | 'NOT_OWNED', message: string) {
    super(message);
  }
}

export const financeService = {
  async listMine(db: Database, personId: string) {
    const invoices = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.personId, personId))
      .orderBy(desc(schema.invoices.createdAt));

    if (invoices.length === 0) return [];

    const ids = invoices.map((i) => i.id);
    const paidRows = await db
      .select({
        invoiceId: schema.payments.invoiceId,
        total: sum(schema.payments.amount).as('total'),
      })
      .from(schema.payments)
      .where(inArray(schema.payments.invoiceId, ids))
      .groupBy(schema.payments.invoiceId);

    const paidMap = new Map<string, string>(
      paidRows.map((r) => [r.invoiceId, (r.total as string | null) ?? '0']),
    );

    return invoices.map((inv) => ({
      ...inv,
      paidAmount: paidMap.get(inv.id) ?? '0',
    }));
  },

  async getMineDetail(db: Database, personId: string, invoiceId: string) {
    const [invoice] = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.id, invoiceId))
      .limit(1);
    if (!invoice) throw new FinanceError('NOT_FOUND', 'Fatura não encontrada.');
    if (invoice.personId !== personId) {
      throw new FinanceError('NOT_OWNED', 'Fatura não pertence ao usuário.');
    }

    const payments = await db
      .select({
        id: schema.payments.id,
        amount: schema.payments.amount,
        paidAt: schema.payments.paidAt,
        method: schema.payments.method,
        receiptUrl: schema.payments.receiptUrl,
        notes: schema.payments.notes,
      })
      .from(schema.payments)
      .where(eq(schema.payments.invoiceId, invoiceId))
      .orderBy(asc(schema.payments.paidAt));

    const paidAmount = payments.reduce(
      (acc, p) => acc + Number(p.amount),
      0,
    );

    return {
      ...invoice,
      payments,
      paidAmount: paidAmount.toFixed(2),
    };
  },
};
