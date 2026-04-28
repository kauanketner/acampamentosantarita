// Helper minimalista pra concatenar classes condicionalmente. Sem dep externa
// (clsx/twmerge não instalados no admin) — falsy values são descartados.
export function cn(
  ...inputs: Array<string | number | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(' ');
}
