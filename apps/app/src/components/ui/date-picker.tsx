import { cn } from '@/lib/cn';
import * as Popover from '@radix-ui/react-popover';
import { format, parse, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import 'react-day-picker/style.css';

type Props = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** ISO yyyy-mm-dd string for form submission. */
  defaultValue?: string;
  invalid?: boolean;
  /** ISO date string max (e.g., today for birth dates). */
  maxDate?: Date;
  /** ISO date string min. */
  minDate?: Date;
  className?: string;
  id?: string;
};

const defaultMin = new Date(1900, 0, 1);

export function DatePicker({
  value,
  onChange,
  placeholder = 'dd / mm / aaaa',
  defaultValue,
  invalid,
  maxDate = new Date(),
  minDate = defaultMin,
  className,
  id,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const initial = React.useMemo(() => {
    if (value) return value;
    if (defaultValue) {
      const d = parse(defaultValue, 'yyyy-MM-dd', new Date());
      return Number.isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
  }, [value, defaultValue]);

  const [internal, setInternal] = React.useState<Date | undefined>(initial);
  const selected = value ?? internal;
  // Default visible month — começar 18 anos atrás faz sentido para idade média
  const [month, setMonth] = React.useState<Date>(selected ?? subYears(maxDate, 18));

  const handleSelect = (next: Date | undefined) => {
    if (!next) return;
    setInternal(next);
    onChange?.(next);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          aria-haspopup="dialog"
          className={cn(
            'flex items-center gap-3 h-12 w-full px-4 text-[15px] text-left',
            'bg-(color:--color-surface) border rounded-(--radius-md)',
            'border-(color:--color-border-strong)',
            'transition-[border-color,box-shadow] duration-200',
            'data-[state=open]:border-(color:--color-primary) data-[state=open]:ring-2 data-[state=open]:ring-(color:--color-ring)',
            'focus:outline-none focus:border-(color:--color-primary) focus:ring-2 focus:ring-(color:--color-ring)',
            invalid && 'border-(color:--color-destructive)',
            className,
          )}
        >
          <CalendarIcon
            className="size-4 text-(color:--color-muted-foreground) shrink-0"
            strokeWidth={1.5}
          />
          <span className={cn('flex-1 truncate', !selected && 'text-(color:--color-subtle)')}>
            {selected ? format(selected, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : placeholder}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className={cn(
            'z-50 rounded-(--radius-lg) border border-(color:--color-border-strong) bg-(color:--color-surface) p-3 shadow-2xl',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'w-[min(96vw,360px)]',
          )}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            locale={ptBR}
            startMonth={minDate}
            endMonth={maxDate}
            captionLayout="dropdown"
            disabled={{ after: maxDate, before: minDate }}
            classNames={dayPickerClassNames}
            components={{
              Chevron: ({ orientation, ...props }) => {
                if (orientation === 'down') {
                  // chevron dentro do dropdown
                  return (
                    <ChevronDown
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none text-(color:--color-muted-foreground)"
                      strokeWidth={1.5}
                      {...props}
                    />
                  );
                }
                if (orientation === 'left') {
                  return <ChevronLeft className="size-4" strokeWidth={1.5} {...props} />;
                }
                return <ChevronRight className="size-4" strokeWidth={1.5} {...props} />;
              },
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const dayPickerClassNames: React.ComponentProps<typeof DayPicker>['classNames'] = {
  root: 'font-sans relative',
  months: 'flex flex-col',
  month: 'flex flex-col gap-2',
  // header com dropdowns no centro e nav em volta
  month_caption: 'flex items-center justify-center gap-2 mb-2 mt-0 pt-0.5 px-9 min-h-9',
  // esconde o caption_label (dropdowns já mostram mês e ano)
  caption_label: 'sr-only',
  nav: 'absolute top-1 inset-x-1 flex items-center justify-between pointer-events-none',
  button_previous:
    'size-8 inline-flex items-center justify-center rounded-full hover:bg-(color:--color-muted) text-(color:--color-foreground) pointer-events-auto disabled:opacity-30',
  button_next:
    'size-8 inline-flex items-center justify-center rounded-full hover:bg-(color:--color-muted) text-(color:--color-foreground) pointer-events-auto disabled:opacity-30',
  weekdays: 'grid grid-cols-7',
  weekday:
    'font-mono text-[10px] uppercase tracking-wider text-(color:--color-subtle) text-center pb-1',
  weeks: 'grid gap-0.5',
  week: 'grid grid-cols-7 gap-0.5',
  day: 'size-9 inline-flex items-center justify-center text-sm rounded-full transition-colors hover:bg-(color:--color-muted)',
  day_button: 'size-9 inline-flex items-center justify-center cursor-pointer',
  selected: '!bg-(color:--color-primary) !text-(color:--color-primary-foreground) font-medium',
  today: 'font-semibold text-(color:--color-primary)',
  outside: 'text-(color:--color-subtle) opacity-50',
  disabled: 'opacity-30 cursor-not-allowed',
  hidden: 'invisible',
  dropdowns: 'flex items-center gap-2',
  dropdown_root: 'relative inline-flex items-center',
  dropdown:
    'rounded-md bg-(color:--color-muted) pl-2.5 pr-7 py-1.5 text-sm font-medium text-(color:--color-foreground) cursor-pointer hover:bg-(color:--color-border) transition appearance-none capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-ring)',
  years_dropdown: '',
  months_dropdown: '',
};
