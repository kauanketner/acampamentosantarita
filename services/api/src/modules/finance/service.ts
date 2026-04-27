// TODO:
// - createAsaasCharge: chama lib/asaas.ts, salva asaas_payment_id e asaas_invoice_url.
// - recordCashPayment: cria payment com method='dinheiro', recorded_by_user_id=admin atual.
// - status do invoice é derivado dos payments (pendente/parcial/pago/reembolsado).
// - cashflowReport: agrega payments por método/período.
// - byEventReport: agrega invoices/payments por evento (via reference_id).

export const financeService = {};
