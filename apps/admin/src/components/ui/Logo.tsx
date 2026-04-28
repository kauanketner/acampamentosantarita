import { cn } from '@/lib/cn';

/**
 * Marca da Comunidade — arco litúrgico estilizado, mesma direção do app
 * campista. Pequeno, monocromático.
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('size-8', className)}
    >
      <path
        d="M16 4 C24 4 28 9 28 16 V32 H4 V16 C4 9 8 4 16 4 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12 C20 12 22 14.5 22 18 V26 H10 V18 C10 14.5 12 12 16 12 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="16" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}
