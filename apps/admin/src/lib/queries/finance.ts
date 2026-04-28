import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export type InvoiceStatus =
  | 'pendente'
  | 'pago'
  | 'parcial'
  | 'vencido'
  | 'cancelado'
  | 'reembolsado';

export type InvoiceType = 'registration' | 'pos' | 'shop' | 'other';

export type PaymentMethod = 'pix' | 'cartao' | 'boleto' | 'dinheiro' | 'transferencia';

export type AdminInvoice = {
  id: string;
  personId: string;
  type: InvoiceType;
  referenceId: string | null;
  referenceType: string | null;
  amount: string;
  paidAmount: string;
  dueDate: string | null;
  status: InvoiceStatus;
  description: string | null;
  asaasPaymentId: string | null;
  asaasInvoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  person: {
    id: string;
    fullName: string;
    mobilePhone: string | null;
  };
};

export type AdminPayment = {
  id: string;
  amount: string;
  paidAt: string;
  method: PaymentMethod;
  receiptUrl: string | null;
  notes: string | null;
};

export type AdminInvoiceDetail = Omit<AdminInvoice, 'person'> & {
  person: AdminInvoice['person'] & {
    city: string | null;
    state: string | null;
  };
  payments: AdminPayment[];
};

export type RecordCashPaymentInput = {
  amount: string;
  method?: PaymentMethod;
  notes?: string | null;
};

const FINANCE_KEY = ['admin', 'finance'] as const;
const invoicesKey = [...FINANCE_KEY, 'invoices'] as const;
const invoiceByIdKey = (id: string) => [...invoicesKey, id] as const;

export function useAdminInvoices() {
  return useQuery<AdminInvoice[]>({
    queryKey: invoicesKey,
    queryFn: async () => {
      const res = await api<{ items: AdminInvoice[] }>('/v1/finance/invoices');
      return res.items;
    },
    staleTime: 15_000,
  });
}

export function useAdminInvoice(id: string | undefined) {
  return useQuery<AdminInvoiceDetail>({
    queryKey: id ? invoiceByIdKey(id) : ([...invoicesKey, '__none__'] as const),
    queryFn: () => api<AdminInvoiceDetail>(`/v1/finance/invoices/${id}`),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useRecordCashPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      input,
    }: {
      invoiceId: string;
      input: RecordCashPaymentInput;
    }) =>
      api<AdminPayment>(`/v1/finance/invoices/${invoiceId}/record-cash`, {
        method: 'POST',
        json: input,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FINANCE_KEY });
    },
  });
}

export function useDeletePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/v1/finance/payments/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FINANCE_KEY });
    },
  });
}

export const adminFinanceQueryKey = FINANCE_KEY;
