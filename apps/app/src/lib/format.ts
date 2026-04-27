// Formata telefone (raw digits) para exibição: "+55 (11) 99999-0000"
export function maskPhoneDisplay(phoneRaw: string): string {
  const digits = phoneRaw.replace(/\D/g, '');
  if (digits.length === 0) return '';
  // Aceita 10 ou 11 dígitos (com ou sem 55 country code)
  const local = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  if (local.length === 11) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return phoneRaw;
}
