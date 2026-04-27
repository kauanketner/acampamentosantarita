// TODO: roteador de eventos do Asaas:
// - PAYMENT_RECEIVED / PAYMENT_CONFIRMED → cria payment, recalcula invoice.status.
// - PAYMENT_OVERDUE → invoice.status='vencido' + notifica pessoa.
// - PAYMENT_REFUNDED → cria refund, invoice.status='reembolsado'.

export const webhooksService = {};
