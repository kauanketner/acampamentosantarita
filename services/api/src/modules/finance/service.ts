import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { asc, desc, eq, inArray, sum } from 'drizzle-orm';
import type { RecordCashPayment } from './schemas.ts';

export class FinanceError extends Error {
  constructor(
    public code:
      | 'NOT_FOUND'
      | 'NOT_OWNED'
      | 'OVERPAID'
      | 'INVOICE_CANCELED',
    message: string,
  ) {
    super(message);
  }
}

async function getPaidAmount(db: Database, invoiceId: string): Promise<number> {
  const rows = await db
    .select({ amount: schema.payments.amount })
    .from(schema.payments)
    .where(eq(schema.payments.invoiceId, invoiceId));
  return rows.reduce((acc, p) => acc + Number(p.amount), 0);
}

function deriveStatus(
  total: number,
  paid: number,
  current: typeof schema.invoices.$inferSelect.status,
): typeof schema.invoices.$inferSelect.status {
  if (current === 'cancelado' || current === 'reembolsado') return current;
  if (paid <= 0) return 'pendente';
  if (paid >= total) return 'pago';
  return 'parcial';
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

  // ===== Admin =====

  async listAll(db: Database) {
    const rows = await db
      .select({
        invoice: schema.invoices,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          mobilePhone: schema.persons.mobilePhone,
        },
      })
      .from(schema.invoices)
      .innerJoin(
        schema.persons,
        eq(schema.invoices.personId, schema.persons.id),
      )
      .orderBy(desc(schema.invoices.createdAt));

    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.invoice.id);
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

    return rows.map((r) => ({
      ...r.invoice,
      paidAmount: paidMap.get(r.invoice.id) ?? '0',
      person: r.person,
    }));
  },

  async getDetailAdmin(db: Database, invoiceId: string) {
    const [row] = await db
      .select({
        invoice: schema.invoices,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          mobilePhone: schema.persons.mobilePhone,
          city: schema.persons.city,
          state: schema.persons.state,
        },
      })
      .from(schema.invoices)
      .innerJoin(
        schema.persons,
        eq(schema.invoices.personId, schema.persons.id),
      )
      .where(eq(schema.invoices.id, invoiceId))
      .limit(1);
    if (!row) throw new FinanceError('NOT_FOUND', 'Fatura não encontrada.');

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
      ...row.invoice,
      person: row.person,
      payments,
      paidAmount: paidAmount.toFixed(2),
    };
  },

  async recordPayment(
    db: Database,
    invoiceId: string,
    payload: RecordCashPayment,
    recordedByUserId: string,
  ) {
    const [invoice] = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.id, invoiceId))
      .limit(1);
    if (!invoice) throw new FinanceError('NOT_FOUND', 'Fatura não encontrada.');
    if (invoice.status === 'cancelado' || invoice.status === 'reembolsado') {
      throw new FinanceError(
        'INVOICE_CANCELED',
        'Fatura cancelada ou reembolsada não aceita novos pagamentos.',
      );
    }

    const total = Number(invoice.amount);
    const alreadyPaid = await getPaidAmount(db, invoiceId);
    const incoming = Number(payload.amount);
    if (alreadyPaid + incoming > total + 0.001) {
      throw new FinanceError(
        'OVERPAID',
        `Pagamento excede o saldo restante (${(total - alreadyPaid).toFixed(2)}).`,
      );
    }

    return db.transaction(async (tx) => {
      const [created] = await tx
        .insert(schema.payments)
        .values({
          invoiceId,
          amount: payload.amount,
          method: payload.method,
          recordedByUserId,
          notes: payload.notes ?? null,
        })
        .returning();

      const newPaid = alreadyPaid + incoming;
      const nextStatus = deriveStatus(total, newPaid, invoice.status);
      if (nextStatus !== invoice.status) {
        await tx
          .update(schema.invoices)
          .set({ status: nextStatus, updatedAt: new Date() })
          .where(eq(schema.invoices.id, invoiceId));
      }
      return created!;
    });
  },

  async deletePayment(db: Database, paymentId: string) {
    const [payment] = await db
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.id, paymentId))
      .limit(1);
    if (!payment) throw new FinanceError('NOT_FOUND', 'Pagamento não encontrado.');

    return db.transaction(async (tx) => {
      await tx.delete(schema.payments).where(eq(schema.payments.id, paymentId));
      const [invoice] = await tx
        .select()
        .from(schema.invoices)
        .where(eq(schema.invoices.id, payment.invoiceId))
        .limit(1);
      if (!invoice) return;
      const remainingRows = await tx
        .select({ amount: schema.payments.amount })
        .from(schema.payments)
        .where(eq(schema.payments.invoiceId, payment.invoiceId));
      const remainingPaid = remainingRows.reduce(
        (acc, p) => acc + Number(p.amount),
        0,
      );
      const nextStatus = deriveStatus(
        Number(invoice.amount),
        remainingPaid,
        invoice.status,
      );
      if (nextStatus !== invoice.status) {
        await tx
          .update(schema.invoices)
          .set({ status: nextStatus, updatedAt: new Date() })
          .where(eq(schema.invoices.id, payment.invoiceId));
      }
    });
  },
};
