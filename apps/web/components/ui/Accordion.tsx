'use client';

import { cn } from '@/lib/cn';
import { useState } from 'react';

type Item = { id: string; question: string; answer: string };

export function Accordion({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <ul className="divide-y divide-(color:--color-rule) border-y border-(color:--color-rule)">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-6 py-6 lg:py-7 text-left group"
            >
              <span
                className={cn(
                  'font-display text-xl lg:text-2xl tracking-tight leading-snug text-pretty transition-colors',
                  open
                    ? 'text-(color:--color-oxblood) italic'
                    : 'text-(color:--color-ink) group-hover:italic',
                )}
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
              >
                {item.question}
              </span>
              <span
                className={cn(
                  'shrink-0 size-9 inline-flex items-center justify-center rounded-full border border-(color:--color-rule) text-(color:--color-ink-faint) transition-all',
                  open && 'border-(color:--color-oxblood) text-(color:--color-oxblood) rotate-45',
                )}
                aria-hidden
              >
                <svg viewBox="0 0 12 12" className="size-3" fill="none">
                  <path
                    d="M6 1V11M1 6H11"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            {open && (
              <div className="pb-7 lg:pb-8 -mt-1 max-w-2xl text-[15px] lg:text-[16px] text-(color:--color-ink-soft) leading-[1.7] text-pretty animate-drift-fade">
                {item.answer.split(/\n{2,}/).map((para, idx) => (
                  <p key={`p-${idx}`} className={idx > 0 ? 'mt-4' : ''}>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
