import type {
  RegistrationPaymentStatus,
  RegistrationStatus,
} from '@/lib/queries/registrations';

const statusInfo: Record<
  RegistrationStatus,
  { label: string; tone: 'neutral' | 'green' | 'amber' | 'red' | 'sky' }
> = {
  pendente: { label: 'Pendente', tone: 'amber' },
  aprovada: { label: 'Aprovada', tone: 'sky' },
  confirmada: { label: 'Confirmada', tone: 'green' },
  em_espera: { label: 'Em espera', tone: 'neutral' },
  cancelada: { label: 'Cancelada', tone: 'neutral' },
  rejeitada: { label: 'Rejeitada', tone: 'red' },
};

const paymentInfo: Record<
  RegistrationPaymentStatus,
  { label: string; tone: 'neutral' | 'green' | 'amber' | 'red' }
> = {
  pago: { label: 'pago', tone: 'green' },
  pendente: { label: 'pagto pendente', tone: 'amber' },
  parcial: { label: 'parcial', tone: 'amber' },
  isento: { label: 'isento', tone: 'neutral' },
  reembolsado: { label: 'reembolsado', tone: 'neutral' },
};

const toneClass: Record<'neutral' | 'green' | 'amber' | 'red' | 'sky', string> = {
  neutral: 'bg-secondary text-secondary-foreground border-border',
  green:
    'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
  amber:
    'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  red:
    'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
  sky:
    'bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-200 dark:border-sky-800',
};

export function StatusBadge({ status }: { status: RegistrationStatus }) {
  const info = statusInfo[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass[info.tone]}`}
    >
      {info.label}
    </span>
  );
}

export function PaymentBadge({
  status,
}: {
  status: RegistrationPaymentStatus;
}) {
  const info = paymentInfo[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass[info.tone]}`}
    >
      {info.label}
    </span>
  );
}
