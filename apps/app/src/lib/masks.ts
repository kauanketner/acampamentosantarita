// Máscaras aplicadas como o usuário digita.
// Cada função aceita um valor (cru ou parcialmente formatado) e devolve a
// versão formatada. Acompanhar com a função `unmask` para enviar à API.

export function unmask(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskCPF(value: string): string {
  const v = unmask(value).slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
  return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
}

export function maskCEP(value: string): string {
  const v = unmask(value).slice(0, 8);
  if (v.length <= 5) return v;
  return `${v.slice(0, 5)}-${v.slice(5)}`;
}

export function maskPhone(value: string): string {
  const v = unmask(value).slice(0, 11);
  if (v.length === 0) return '';
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) {
    return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  }
  // celular (11 dígitos)
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

// Validações leves — para feedback visual. Não substitui validação no backend.
export function isValidCPF(value: string): boolean {
  const v = unmask(value);
  if (v.length !== 11) return false;
  if (/^(\d)\1+$/.test(v)) return false;
  // dígitos verificadores
  const digits = v.split('').map(Number);
  for (let n = 9; n < 11; n++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += digits[i]! * (n + 1 - i);
    let result = (sum * 10) % 11;
    if (result === 10) result = 0;
    if (result !== digits[n]) return false;
  }
  return true;
}

export function isValidCEP(value: string): boolean {
  return unmask(value).length === 8;
}

export function isValidPhone(value: string): boolean {
  const len = unmask(value).length;
  return len === 10 || len === 11;
}
