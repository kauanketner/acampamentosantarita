import { cn } from '@/lib/cn';
import { motion } from 'motion/react';
import type * as React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Reserve space for BottomNav (default true). Set false on focused/cadastro screens. */
  withBottomNav?: boolean;
};

export function Page({ children, className, withBottomNav = true }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0.32, 1] }}
      className={cn(
        'relative min-h-[100dvh]',
        withBottomNav && 'pb-[calc(env(safe-area-inset-bottom)+72px)]',
        className,
      )}
    >
      {children}
    </motion.main>
  );
}
