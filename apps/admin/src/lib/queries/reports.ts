import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export type DashboardKPIs = {
  personsTotal: number;
  eventsTotal: number;
  activeEvents: number;
  pendingRegistrations: number;
  openInvoicesCount: number;
  openInvoicesAmount: string;
};

export type RegistrationsReport = {
  byStatus: Array<{ status: string; total: number }>;
  byEvent: Array<{
    eventId: string;
    eventName: string;
    total: number;
    approved: number;
    pending: number;
    canceled: number;
  }>;
};

export type FinanceReport = {
  payments: Array<{ month: string; total: string; method: string }>;
  invoiceTotals: Array<{ status: string; total: string; count: number }>;
  recentPayments: Array<{
    id: string;
    amount: string;
    method: string;
    paidAt: string;
    invoiceId: string;
    personName: string;
  }>;
};

export type ParticipantsByEventRow = {
  eventId: string;
  eventName: string;
  startDate: string;
  type: string;
  total: number;
  campistas: number;
  equipistas: number;
  confirmed: number;
};

export type LegacyHistoryRow = {
  campEdition: number;
  campYear: number | null;
  total: number;
  campistas: number;
  equipistas: number;
  lideres: number;
};

export type AuditLogRow = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  userEmail: string | null;
  userPhone: string | null;
};

export type AdminPayment = {
  id: string;
  invoiceId: string;
  amount: string;
  method: 'pix' | 'cartao' | 'boleto' | 'dinheiro' | 'transferencia';
  paidAt: string;
  notes: string | null;
  person: { id: string; fullName: string };
  invoice: { id: string; type: string; description: string | null };
};

export type AdminRefund = {
  id: string;
  paymentId: string;
  amount: string;
  reason: string | null;
  refundedAt: string;
  person: { id: string; fullName: string };
  invoice: { id: string; description: string | null };
};

export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: ['reports', 'dashboard'] as const,
    queryFn: () => api<DashboardKPIs>('/v1/reports/dashboard'),
    staleTime: 30_000,
  });
}

export function useRegistrationsReport() {
  return useQuery<RegistrationsReport>({
    queryKey: ['reports', 'registrations'] as const,
    queryFn: () => api<RegistrationsReport>('/v1/reports/registrations'),
    staleTime: 30_000,
  });
}

export function useFinanceReport() {
  return useQuery<FinanceReport>({
    queryKey: ['reports', 'finance'] as const,
    queryFn: () => api<FinanceReport>('/v1/reports/finance'),
    staleTime: 30_000,
  });
}

export function useParticipantsByEvent() {
  return useQuery<ParticipantsByEventRow[]>({
    queryKey: ['reports', 'participants-by-event'] as const,
    queryFn: async () => {
      const res = await api<{ items: ParticipantsByEventRow[] }>(
        '/v1/reports/participants-by-event',
      );
      return res.items;
    },
    staleTime: 60_000,
  });
}

export function useLegacyHistory() {
  return useQuery<LegacyHistoryRow[]>({
    queryKey: ['reports', 'legacy-history'] as const,
    queryFn: async () => {
      const res = await api<{ items: LegacyHistoryRow[] }>('/v1/reports/legacy-history');
      return res.items;
    },
    staleTime: 60_000,
  });
}

export function useAuditLog() {
  return useQuery<AuditLogRow[]>({
    queryKey: ['reports', 'audit'] as const,
    queryFn: async () => {
      const res = await api<{ items: AuditLogRow[] }>('/v1/reports/audit');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useAdminPayments() {
  return useQuery<AdminPayment[]>({
    queryKey: ['admin', 'finance', 'payments'] as const,
    queryFn: async () => {
      const res = await api<{ items: AdminPayment[] }>('/v1/finance/payments');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useAdminRefunds() {
  return useQuery<AdminRefund[]>({
    queryKey: ['admin', 'finance', 'refunds'] as const,
    queryFn: async () => {
      const res = await api<{ items: AdminRefund[] }>('/v1/finance/refunds');
      return res.items;
    },
    staleTime: 30_000,
  });
}
