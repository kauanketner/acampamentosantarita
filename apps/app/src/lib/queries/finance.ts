import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export type InvoiceType = 'registration' | 'pos' | 'shop' | 'other';

export type InvoiceStatus =
  | 'pendente'
  | 'pago'
  | 'parcial'
  | 'vencido'
  | 'cancelado'
  | 'reembolsado';

export type PaymentMethod = 'pix' | 'cartao' | 'boleto' | 'dinheiro' | 'transferencia';

export type Invoice = {
  id: string;
  personId: string;
  type: InvoiceType;
  referenceId: string | null;
  referenceType: string | null;
  amount: string;
  dueDate: string | null;
  status: InvoiceStatus;
  description: string | null;
  asaasPaymentId: string | null;
  asaasInvoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  paidAmount: string;
};

export type Payment = {
  id: string;
  amount: string;
  paidAt: string;
  method: PaymentMethod;
  receiptUrl: string | null;
  notes: string | null;
};

export type InvoiceDetail = Omit<Invoice, 'paidAmount'> & {
  payments: Payment[];
  paidAmount: string;
};

const FINANCE_KEY = ['finance', 'me'] as const;
const invoicesKey = [...FINANCE_KEY, 'invoices'] as const;
const invoiceByIdKey = (id: string) => [...invoicesKey, id] as const;

export function useMyInvoices() {
  return useQuery<Invoice[]>({
    queryKey: invoicesKey,
    queryFn: async () => {
      const res = await api<{ items: Invoice[] }>('/v1/finance/me/invoices');
      return res.items;
    },
    staleTime: 30_000,
  });
}

export function useMyInvoice(id: string | undefined) {
  return useQuery<InvoiceDetail>({
    queryKey: id ? invoiceByIdKey(id) : ([...invoicesKey, '__none__'] as const),
    queryFn: () => api<InvoiceDetail>(`/v1/finance/me/invoices/${id}`),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export const financeQueryKey = FINANCE_KEY;
