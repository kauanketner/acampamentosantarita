import { Badge, type Tone } from '@/components/ui/Badge';
import type { RegistrationPaymentStatus, RegistrationStatus } from '@/lib/queries/registrations';

const statusInfo: Record<RegistrationStatus, { label: string; tone: Tone }> = {
  pendente: { label: 'Pendente', tone: 'warning' },
  aprovada: { label: 'Aprovada', tone: 'info' },
  confirmada: { label: 'Confirmada', tone: 'success' },
  em_espera: { label: 'Em espera', tone: 'neutral' },
  cancelada: { label: 'Cancelada', tone: 'neutral' },
  rejeitada: { label: 'Rejeitada', tone: 'danger' },
};

const paymentInfo: Record<RegistrationPaymentStatus, { label: string; tone: Tone }> = {
  pago: { label: 'pago', tone: 'success' },
  pendente: { label: 'pagto pendente', tone: 'warning' },
  parcial: { label: 'parcial', tone: 'warning' },
  isento: { label: 'isento', tone: 'neutral' },
  reembolsado: { label: 'reembolsado', tone: 'neutral' },
};

export function StatusBadge({ status }: { status: RegistrationStatus }) {
  const info = statusInfo[status];
  return (
    <Badge tone={info.tone} dot={status === 'pendente'} size="sm">
      {info.label}
    </Badge>
  );
}

export function PaymentBadge({
  status,
}: {
  status: RegistrationPaymentStatus;
}) {
  const info = paymentInfo[status];
  return (
    <Badge tone={info.tone} size="sm">
      {info.label}
    </Badge>
  );
}
