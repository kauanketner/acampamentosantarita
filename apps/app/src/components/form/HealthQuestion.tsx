import type * as React from 'react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/input';
import { cn } from '@/lib/cn';

type Props = {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  detail?: string;
  onDetailChange?: (next: string) => void;
  detailPlaceholder?: string;
  className?: string;
};

// Cartão para uma pergunta de saúde estilo "sim/não" — quando sim, expande
// suavemente para receber detalhe. Pensado para leitura mobile.
export function HealthQuestion({
  label,
  hint,
  value,
  onValueChange,
  detail,
  onDetailChange,
  detailPlaceholder,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface)',
        'transition-colors',
        value && 'border-(color:--color-primary)/40 bg-(color:--color-primary-soft)/40',
        className,
      )}
    >
      <label className="flex items-start gap-3 p-4 cursor-pointer">
        <div className="flex-1 pr-2">
          <p className="text-[15px] font-medium leading-snug text-(color:--color-foreground)">
            {label}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-(color:--color-muted-foreground) leading-snug">
              {hint}
            </p>
          )}
        </div>
        <Switch checked={value} onCheckedChange={onValueChange} />
      </label>
      {value && onDetailChange && (
        <div className="px-4 pb-4 -mt-1">
          <Textarea
            value={detail ?? ''}
            onChange={(e) => onDetailChange(e.target.value)}
            placeholder={detailPlaceholder ?? 'Conte um pouco mais.'}
            className="min-h-20"
          />
        </div>
      )}
    </div>
  );
}
