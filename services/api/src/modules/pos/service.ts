import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq } from 'drizzle-orm';
import type { AddTransaction, CreatePosItem, OpenAccount, UpdatePosItem } from './schemas.ts';

export class PosError extends Error {
  constructor(
    public code:
      | 'NOT_FOUND'
      | 'EVENT_NOT_FOUND'
      | 'PERSON_NOT_FOUND'
      | 'ALREADY_OPEN'
      | 'NOT_OPEN'
      | 'TRANSACTION_NOT_FOUND',
    message: string,
  ) {
    super(message);
  }
}

function recalcTotal(transactions: { total: string | number }[]): string {
  const total = transactions.reduce((acc, t) => acc + Number(t.total), 0);
  return total.toFixed(2);
}

export const posService = {
  // ===== Items =====

  async listItems(db: Database, opts?: { onlyActive?: boolean }) {
    const rows = await db
      .select()
      .from(schema.posItems)
      .orderBy(asc(schema.posItems.category), asc(schema.posItems.name));
    if (opts?.onlyActive) return rows.filter((r) => r.active);
    return rows;
  },

  async createItem(db: Database, payload: CreatePosItem) {
    const [created] = await db
      .insert(schema.posItems)
      .values({
        name: payload.name,
        sku: payload.sku ?? null,
        category: payload.category,
        price: payload.price,
        active: payload.active,
        stock: payload.stock ?? null,
      })
      .returning();
    return created!;
  },

  async updateItem(db: Database, id: string, payload: UpdatePosItem) {
    const [existing] = await db
      .select({ id: schema.posItems.id })
      .from(schema.posItems)
      .where(eq(schema.posItems.id, id))
      .limit(1);
    if (!existing) throw new PosError('NOT_FOUND', 'Item não encontrado.');

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      patch[key] = value;
    }

    const [updated] = await db
      .update(schema.posItems)
      .set(patch)
      .where(eq(schema.posItems.id, id))
      .returning();
    return updated!;
  },

  async deleteItem(db: Database, id: string) {
    await db.delete(schema.posItems).where(eq(schema.posItems.id, id));
  },

  // ===== Accounts =====

  async listAccounts(
    db: Database,
    opts: { eventId?: string; status?: 'aberta' | 'fechada' | 'paga' } = {},
  ) {
    const where = [];
    if (opts.eventId) where.push(eq(schema.posAccounts.eventId, opts.eventId));
    if (opts.status) where.push(eq(schema.posAccounts.status, opts.status));

    const rows = await db
      .select({
        account: schema.posAccounts,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          mobilePhone: schema.persons.mobilePhone,
          avatarUrl: schema.persons.avatarUrl,
        },
        event: {
          id: schema.events.id,
          name: schema.events.name,
          startDate: schema.events.startDate,
        },
      })
      .from(schema.posAccounts)
      .innerJoin(schema.persons, eq(schema.posAccounts.personId, schema.persons.id))
      .innerJoin(schema.events, eq(schema.posAccounts.eventId, schema.events.id))
      .where(where.length ? and(...where) : undefined)
      .orderBy(desc(schema.posAccounts.openedAt));

    return rows.map((r) => ({
      ...r.account,
      person: r.person,
      event: r.event,
    }));
  },

  async getAccountAdmin(db: Database, accountId: string) {
    const [row] = await db
      .select({
        account: schema.posAccounts,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          mobilePhone: schema.persons.mobilePhone,
          avatarUrl: schema.persons.avatarUrl,
        },
        event: {
          id: schema.events.id,
          name: schema.events.name,
          startDate: schema.events.startDate,
        },
      })
      .from(schema.posAccounts)
      .innerJoin(schema.persons, eq(schema.posAccounts.personId, schema.persons.id))
      .innerJoin(schema.events, eq(schema.posAccounts.eventId, schema.events.id))
      .where(eq(schema.posAccounts.id, accountId))
      .limit(1);
    if (!row) throw new PosError('NOT_FOUND', 'Conta não encontrada.');

    const transactions = await db
      .select()
      .from(schema.posTransactions)
      .where(eq(schema.posTransactions.posAccountId, accountId))
      .orderBy(desc(schema.posTransactions.createdAt));

    return {
      ...row.account,
      person: row.person,
      event: row.event,
      transactions,
    };
  },

  async openAccount(db: Database, payload: OpenAccount) {
    const [event] = await db
      .select({ id: schema.events.id })
      .from(schema.events)
      .where(eq(schema.events.id, payload.eventId))
      .limit(1);
    if (!event) throw new PosError('EVENT_NOT_FOUND', 'Evento não encontrado.');

    const [person] = await db
      .select({ id: schema.persons.id })
      .from(schema.persons)
      .where(eq(schema.persons.id, payload.personId))
      .limit(1);
    if (!person) throw new PosError('PERSON_NOT_FOUND', 'Pessoa não encontrada.');

    const [existing] = await db
      .select({ id: schema.posAccounts.id })
      .from(schema.posAccounts)
      .where(
        and(
          eq(schema.posAccounts.personId, payload.personId),
          eq(schema.posAccounts.eventId, payload.eventId),
          eq(schema.posAccounts.status, 'aberta'),
        ),
      )
      .limit(1);
    if (existing) {
      throw new PosError('ALREADY_OPEN', 'Já existe conta aberta para esta pessoa neste evento.');
    }

    const [created] = await db
      .insert(schema.posAccounts)
      .values({
        personId: payload.personId,
        eventId: payload.eventId,
        status: 'aberta',
        totalAmount: '0',
      })
      .returning();
    return created!;
  },

  async closeAccount(db: Database, accountId: string) {
    const [existing] = await db
      .select()
      .from(schema.posAccounts)
      .where(eq(schema.posAccounts.id, accountId))
      .limit(1);
    if (!existing) throw new PosError('NOT_FOUND', 'Conta não encontrada.');
    if (existing.status !== 'aberta') {
      throw new PosError('NOT_OPEN', 'Conta já está fechada.');
    }

    return db.transaction(async (tx) => {
      const [updated] = await tx
        .update(schema.posAccounts)
        .set({ status: 'fechada', closedAt: new Date(), updatedAt: new Date() })
        .where(eq(schema.posAccounts.id, accountId))
        .returning();

      // Cria invoice tipo 'pos' com saldo da conta — se houver
      const total = Number(existing.totalAmount);
      if (total > 0) {
        await tx.insert(schema.invoices).values({
          personId: existing.personId,
          type: 'pos',
          referenceId: accountId,
          referenceType: 'pos_account',
          amount: existing.totalAmount,
          status: 'pendente',
          description: 'Cantina/Lojinha — Conta do evento',
        });
      }
      return updated!;
    });
  },

  async addTransaction(
    db: Database,
    accountId: string,
    payload: AddTransaction,
    recordedByUserId: string,
  ) {
    const [account] = await db
      .select()
      .from(schema.posAccounts)
      .where(eq(schema.posAccounts.id, accountId))
      .limit(1);
    if (!account) throw new PosError('NOT_FOUND', 'Conta não encontrada.');
    if (account.status !== 'aberta') {
      throw new PosError('NOT_OPEN', 'Conta não está aberta para lançamentos.');
    }

    const total = (Number(payload.unitPrice) * payload.quantity).toFixed(2);

    return db.transaction(async (tx) => {
      const [created] = await tx
        .insert(schema.posTransactions)
        .values({
          posAccountId: accountId,
          posItemId: payload.posItemId ?? null,
          itemName: payload.itemName,
          quantity: payload.quantity,
          unitPrice: payload.unitPrice,
          total,
          recordedByUserId,
          notes: payload.notes ?? null,
        })
        .returning();

      // Recalcula total
      const all = await tx
        .select({ total: schema.posTransactions.total })
        .from(schema.posTransactions)
        .where(eq(schema.posTransactions.posAccountId, accountId));
      const newTotal = recalcTotal(all);

      await tx
        .update(schema.posAccounts)
        .set({ totalAmount: newTotal, updatedAt: new Date() })
        .where(eq(schema.posAccounts.id, accountId));

      return created!;
    });
  },

  async deleteTransaction(db: Database, transactionId: string) {
    const [existing] = await db
      .select()
      .from(schema.posTransactions)
      .where(eq(schema.posTransactions.id, transactionId))
      .limit(1);
    if (!existing) {
      throw new PosError('TRANSACTION_NOT_FOUND', 'Lançamento não encontrado.');
    }

    return db.transaction(async (tx) => {
      await tx.delete(schema.posTransactions).where(eq(schema.posTransactions.id, transactionId));

      const remaining = await tx
        .select({ total: schema.posTransactions.total })
        .from(schema.posTransactions)
        .where(eq(schema.posTransactions.posAccountId, existing.posAccountId));
      const newTotal = recalcTotal(remaining);

      await tx
        .update(schema.posAccounts)
        .set({ totalAmount: newTotal, updatedAt: new Date() })
        .where(eq(schema.posAccounts.id, existing.posAccountId));
    });
  },

  // ===== PWA =====

  async getMyCurrentAccount(db: Database, personId: string) {
    const [account] = await db
      .select({
        account: schema.posAccounts,
        event: {
          id: schema.events.id,
          name: schema.events.name,
          slug: schema.events.slug,
          startDate: schema.events.startDate,
          endDate: schema.events.endDate,
        },
      })
      .from(schema.posAccounts)
      .innerJoin(schema.events, eq(schema.posAccounts.eventId, schema.events.id))
      .where(eq(schema.posAccounts.personId, personId))
      .orderBy(asc(schema.posAccounts.status), desc(schema.events.startDate))
      .limit(1);

    if (!account) return null;

    const transactions = await db
      .select()
      .from(schema.posTransactions)
      .where(eq(schema.posTransactions.posAccountId, account.account.id))
      .orderBy(desc(schema.posTransactions.createdAt));

    return {
      ...account.account,
      event: account.event,
      transactions,
    };
  },
};
