import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq } from 'drizzle-orm';

export const posService = {
  // Conta PDV mais recente da pessoa (preferindo abertas), com transações.
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
      // ordem: aberta primeiro, depois pelo evento mais recente
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
