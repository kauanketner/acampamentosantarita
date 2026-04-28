import { cn } from '@/lib/cn';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('santarita-theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('santarita-theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'size-9 rounded-full inline-flex items-center justify-center',
        'border border-(color:--color-border)',
        'text-(color:--color-muted-foreground)',
        'hover:bg-(color:--color-surface-2) hover:text-(color:--color-foreground)',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-primary)/35',
      )}
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? (
        // sun
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 4v1.5M12 18.5V20M5 12H3.5M20.5 12H19M6.343 6.343l-1.06-1.06M19.717 19.717l-1.06-1.06M6.343 17.657l-1.06 1.06M19.717 4.283l-1.06 1.06"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // moon
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
          <path
            d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
