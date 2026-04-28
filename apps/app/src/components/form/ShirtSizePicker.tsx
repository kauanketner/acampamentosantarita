import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/cn';
import { Ruler } from 'lucide-react';
import { useState } from 'react';

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG'] as const;
type Size = (typeof SIZES)[number];

const MEASUREMENTS: Record<Size, { chest: string; waist: string; length: number }> = {
  PP: { chest: '86–90', waist: '72–76', length: 64 },
  P: { chest: '90–95', waist: '76–82', length: 66 },
  M: { chest: '95–100', waist: '82–88', length: 68 },
  G: { chest: '100–106', waist: '88–96', length: 70 },
  GG: { chest: '106–114', waist: '96–104', length: 72 },
  XGG: { chest: '114–122', waist: '104–112', length: 74 },
};

type Props = {
  value?: Size | '';
  onChange?: (size: Size) => void;
  name?: string;
};

export function ShirtSizePicker({ value, onChange, name = 'shirt' }: Props) {
  const [openTable, setOpenTable] = useState(false);

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-6 gap-2">
        {SIZES.map((s) => {
          const checked = value === s;
          return (
            <label
              key={s}
              className={cn(
                'relative flex items-center justify-center h-11 rounded-(--radius-sm) border text-sm font-medium cursor-pointer transition-colors',
                checked
                  ? 'border-(color:--color-primary) bg-(color:--color-primary-soft) text-(color:--color-primary)'
                  : 'border-(color:--color-border-strong) bg-(color:--color-surface) hover:bg-(color:--color-muted)',
              )}
            >
              <input
                type="radio"
                name={name}
                value={s}
                checked={checked}
                onChange={() => onChange?.(s)}
                className="sr-only"
              />
              {s}
            </label>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setOpenTable(true)}
        className="self-start inline-flex items-center gap-1.5 text-xs text-(color:--color-muted-foreground) hover:text-(color:--color-primary) transition pt-1"
      >
        <Ruler className="size-3.5" strokeWidth={1.5} />
        Ver tabela de medidas
      </button>

      <Sheet open={openTable} onOpenChange={setOpenTable}>
        <SheetContent>
          <SheetTitle>Tabela de medidas</SheetTitle>
          <SheetDescription>
            Em centímetros. Quando estiver na dúvida, escolha o maior.
          </SheetDescription>

          <div className="px-6 pb-8 pt-3 overflow-x-auto no-scrollbar">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr>
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-(color:--color-muted-foreground) pb-2.5 pr-3">
                    Tamanho
                  </th>
                  {SIZES.map((s) => (
                    <th
                      key={s}
                      className={cn(
                        'text-center font-display text-base tracking-tight pb-2.5 px-1',
                        value === s && 'text-(color:--color-primary)',
                      )}
                      style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(['chest', 'waist', 'length'] as const).map((row) => (
                  <tr key={row} className="border-t border-(color:--color-border) first:border-t-0">
                    <td className="py-3 pr-3 text-(color:--color-muted-foreground) text-[13px]">
                      {row === 'chest' ? 'Peito' : row === 'waist' ? 'Cintura' : 'Comprimento'}
                    </td>
                    {SIZES.map((s) => (
                      <td
                        key={s}
                        className={cn(
                          'py-3 px-1 text-center text-[13px]',
                          value === s &&
                            'font-medium text-(color:--color-foreground) bg-(color:--color-primary-soft)/50',
                        )}
                      >
                        {row === 'length'
                          ? MEASUREMENTS[s].length
                          : row === 'chest'
                            ? MEASUREMENTS[s].chest
                            : MEASUREMENTS[s].waist}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-6 text-xs text-(color:--color-muted-foreground) leading-relaxed">
              <strong className="text-(color:--color-foreground) font-medium">Como medir:</strong>{' '}
              passe a fita em volta da parte mais larga do peito (sem apertar) e da cintura (na
              altura do umbigo). Comprimento é do ombro até onde quer que a barra termine.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
