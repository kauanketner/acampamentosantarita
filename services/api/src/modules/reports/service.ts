import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, count, desc, eq, gte, inArray, isNull, sql, sum } from 'drizzle-orm';

export const reportsService = {
  // KPIs do topo: contagens gerais.
  async dashboard(db: Database) {
    const [persons] = await db
      .select({ total: count() })
      .from(schema.persons)
      .where(isNull(schema.persons.deletedAt));
    const [events] = await db
      .select({ total: count() })
      .from(schema.events)
      .where(isNull(schema.events.deletedAt));
    const [activeEvents] = await db
      .select({ total: count() })
      .from(schema.events)
      .where(
        and(
          isNull(schema.events.deletedAt),
          inArray(schema.events.status, [
            'inscricoes_abertas',
            'inscricoes_fechadas',
            'em_andamento',
          ] as const),
        ),
      );
    const [pendingRegs] = await db
      .select({ total: count() })
      .from(schema.registrations)
      .where(eq(schema.registrations.status, 'pendente'));
    const [openInvoices] = await db
      .select({
        total: count(),
        sum: sum(schema.invoices.amount).as('sum'),
      })
      .from(schema.invoices)
      .where(inArray(schema.invoices.status, ['pendente', 'parcial', 'vencido'] as const));

    return {
      personsTotal: Number(persons?.total ?? 0),
      eventsTotal: Number(events?.total ?? 0),
      activeEvents: Number(activeEvents?.total ?? 0),
      pendingRegistrations: Number(pendingRegs?.total ?? 0),
      openInvoicesCount: Number(openInvoices?.total ?? 0),
      openInvoicesAmount: (openInvoices?.sum as string | null) ?? '0',
    };
  },

  // Inscrições agregadas por status, com totais e quebra por evento.
  async registrationsReport(db: Database) {
    const byStatus = await db
      .select({
        status: schema.registrations.status,
        total: count().as('total'),
      })
      .from(schema.registrations)
      .groupBy(schema.registrations.status);

    const byEvent = await db
      .select({
        eventId: schema.registrations.eventId,
        eventName: schema.events.name,
        total: count().as('total'),
        approved:
          sql<number>`count(*) filter (where ${schema.registrations.status} in ('aprovada', 'confirmada'))`.as(
            'approved',
          ),
        pending:
          sql<number>`count(*) filter (where ${schema.registrations.status} = 'pendente')`.as(
            'pending',
          ),
        canceled:
          sql<number>`count(*) filter (where ${schema.registrations.status} in ('cancelada', 'rejeitada'))`.as(
            'canceled',
          ),
      })
      .from(schema.registrations)
      .innerJoin(schema.events, eq(schema.registrations.eventId, schema.events.id))
      .groupBy(schema.registrations.eventId, schema.events.name)
      .orderBy(desc(schema.events.startDate));

    return { byStatus, byEvent };
  },

  // Cashflow: receita por mês (últimos 12) + total por status de invoice.
  async financeReport(db: Database) {
    // Receitas por mês a partir de payments.
    const payments = await db
      .select({
        month: sql<string>`to_char(${schema.payments.paidAt}, 'YYYY-MM')`.as('month'),
        total: sum(schema.payments.amount).as('total'),
        method: schema.payments.method,
      })
      .from(schema.payments)
      .groupBy(sql`to_char(${schema.payments.paidAt}, 'YYYY-MM')`, schema.payments.method)
      .orderBy(sql`to_char(${schema.payments.paidAt}, 'YYYY-MM') desc`);

    // Saldo de invoices por status.
    const invoiceTotals = await db
      .select({
        status: schema.invoices.status,
        total: sum(schema.invoices.amount).as('total'),
        count: count().as('count'),
      })
      .from(schema.invoices)
      .groupBy(schema.invoices.status);

    // Pagamentos recentes (últimos 30 dias) — pra timeline.
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPayments = await db
      .select({
        id: schema.payments.id,
        amount: schema.payments.amount,
        method: schema.payments.method,
        paidAt: schema.payments.paidAt,
        invoiceId: schema.payments.invoiceId,
        personName: schema.persons.fullName,
      })
      .from(schema.payments)
      .innerJoin(schema.invoices, eq(schema.payments.invoiceId, schema.invoices.id))
      .innerJoin(schema.persons, eq(schema.invoices.personId, schema.persons.id))
      .where(gte(schema.payments.paidAt, since))
      .orderBy(desc(schema.payments.paidAt))
      .limit(50);

    return { payments, invoiceTotals, recentPayments };
  },

  async listPayments(db: Database, limit = 200) {
    return db
      .select({
        id: schema.payments.id,
        invoiceId: schema.payments.invoiceId,
        amount: schema.payments.amount,
        method: schema.payments.method,
        paidAt: schema.payments.paidAt,
        notes: schema.payments.notes,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
        },
        invoice: {
          id: schema.invoices.id,
          type: schema.invoices.type,
          description: schema.invoices.description,
        },
      })
      .from(schema.payments)
      .innerJoin(schema.invoices, eq(schema.payments.invoiceId, schema.invoices.id))
      .innerJoin(schema.persons, eq(schema.invoices.personId, schema.persons.id))
      .orderBy(desc(schema.payments.paidAt))
      .limit(limit);
  },

  async listRefunds(db: Database, limit = 100) {
    return db
      .select({
        id: schema.refunds.id,
        paymentId: schema.refunds.paymentId,
        amount: schema.refunds.amount,
        reason: schema.refunds.reason,
        refundedAt: schema.refunds.refundedAt,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
        },
        invoice: {
          id: schema.invoices.id,
          description: schema.invoices.description,
        },
      })
      .from(schema.refunds)
      .innerJoin(schema.payments, eq(schema.refunds.paymentId, schema.payments.id))
      .innerJoin(schema.invoices, eq(schema.payments.invoiceId, schema.invoices.id))
      .innerJoin(schema.persons, eq(schema.invoices.personId, schema.persons.id))
      .orderBy(desc(schema.refunds.refundedAt))
      .limit(limit);
  },

  async participantsByEvent(db: Database) {
    return db
      .select({
        eventId: schema.events.id,
        eventName: schema.events.name,
        startDate: schema.events.startDate,
        type: schema.events.type,
        total: count(schema.registrations.id).as('total'),
        campistas:
          sql<number>`count(${schema.registrations.id}) filter (where ${schema.registrations.roleIntent} = 'campista')`.as(
            'campistas',
          ),
        equipistas:
          sql<number>`count(${schema.registrations.id}) filter (where ${schema.registrations.roleIntent} = 'equipista')`.as(
            'equipistas',
          ),
        confirmed:
          sql<number>`count(${schema.registrations.id}) filter (where ${schema.registrations.status} = 'confirmada')`.as(
            'confirmed',
          ),
      })
      .from(schema.events)
      .leftJoin(schema.registrations, eq(schema.registrations.eventId, schema.events.id))
      .where(isNull(schema.events.deletedAt))
      .groupBy(schema.events.id, schema.events.name, schema.events.startDate, schema.events.type)
      .orderBy(desc(schema.events.startDate));
  },

  async legacyHistory(db: Database) {
    // Distribuição de campParticipations: por edição numerada.
    return db
      .select({
        campEdition: schema.campParticipations.campEdition,
        campYear: schema.campParticipations.campYear,
        total: count().as('total'),
        campistas:
          sql<number>`count(*) filter (where ${schema.campParticipations.role} = 'campista')`.as(
            'campistas',
          ),
        equipistas:
          sql<number>`count(*) filter (where ${schema.campParticipations.role} = 'equipista')`.as(
            'equipistas',
          ),
        lideres:
          sql<number>`count(*) filter (where ${schema.campParticipations.role} = 'lider')`.as(
            'lideres',
          ),
      })
      .from(schema.campParticipations)
      .groupBy(schema.campParticipations.campEdition, schema.campParticipations.campYear)
      .orderBy(desc(schema.campParticipations.campEdition));
  },

  async listAuditLog(db: Database, limit = 200) {
    return db
      .select({
        id: schema.auditLog.id,
        action: schema.auditLog.action,
        entityType: schema.auditLog.entityType,
        entityId: schema.auditLog.entityId,
        ip: schema.auditLog.ip,
        userAgent: schema.auditLog.userAgent,
        createdAt: schema.auditLog.createdAt,
        userEmail: schema.users.email,
        userPhone: schema.users.phone,
      })
      .from(schema.auditLog)
      .leftJoin(schema.users, eq(schema.auditLog.userId, schema.users.id))
      .orderBy(desc(schema.auditLog.createdAt))
      .limit(limit);
  },
};
