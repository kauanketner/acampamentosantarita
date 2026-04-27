import { Link } from '@tanstack/react-router';
import type * as React from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { cn } from '@/lib/cn';

type Props = {
  step: number;
  total: number;
  variant: 'primeira-vez' | 'veterano';
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** primary CTA label (e.g. "Próximo", "Concluir"). */
  ctaLabel?: string;
  ctaTo?:
    | '/cadastro/primeira-vez/passo-2'
    | '/cadastro/primeira-vez/passo-3'
    | '/cadastro/primeira-vez/passo-4'
    | '/cadastro/primeira-vez/passo-5'
    | '/cadastro/primeira-vez/concluido'
    | '/cadastro/veterano/passo-2'
    | '/cadastro/veterano/passo-3'
    | '/cadastro/veterano/passo-4'
    | '/cadastro/veterano/passo-5'
    | '/cadastro/veterano/passo-6'
    | '/cadastro/veterano/concluido';
  ctaDisabled?: boolean;
  /** Optional secondary action below CTA */
  secondary?: React.ReactNode;
  back?: string | boolean;
};

export function CadastroFrame({
  step,
  total,
  variant: _variant,
  eyebrow,
  title,
  description,
  children,
  ctaLabel = 'Próximo',
  ctaTo,
  ctaDisabled,
  secondary,
  back = true,
}: Props) {
  return (
    <Page withBottomNav={false} className="flex flex-col">
      <TopBar back={back} />
      <div className="px-5 pb-3">
        <Stepper current={step} total={total} className="" />
      </div>
      <div className="px-5 pt-4 pb-3">
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
            {eyebrow}
          </p>
        )}
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-pretty">
            {description}
          </p>
        )}
      </div>

      <div className="flex-1 px-5 py-4 pb-32">{children}</div>

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-30 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]',
          'bg-(color:--color-background)/85 backdrop-blur-md border-t border-(color:--color-border)',
        )}
      >
        {ctaTo && !ctaDisabled ? (
          <Button asChild block size="lg">
            <Link to={ctaTo}>{ctaLabel}</Link>
          </Button>
        ) : (
          <Button block size="lg" disabled>
            {ctaLabel}
          </Button>
        )}
        {secondary && <div className="mt-2 text-center">{secondary}</div>}
      </div>
    </Page>
  );
}
