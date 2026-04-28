import { maskCEP, maskCPF, maskPhone } from '@/lib/masks';
import * as React from 'react';
import { Input } from './input';

type Mask = 'cpf' | 'cep' | 'phone';

const masks: Record<Mask, (v: string) => string> = {
  cpf: maskCPF,
  cep: maskCEP,
  phone: maskPhone,
};

const placeholders: Record<Mask, string> = {
  cpf: '000.000.000-00',
  cep: '00000-000',
  phone: '(00) 00000-0000',
};

const inputModes: Record<Mask, React.HTMLAttributes<HTMLInputElement>['inputMode']> = {
  cpf: 'numeric',
  cep: 'numeric',
  phone: 'tel',
};

const maxLengths: Record<Mask, number> = {
  cpf: 14, // 000.000.000-00
  cep: 9, // 00000-000
  phone: 16, // (00) 00000-0000
};

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'inputMode' | 'maxLength' | 'placeholder' | 'type'
> & {
  mask: Mask;
  value?: string;
  defaultValue?: string;
  onValueChange?: (formatted: string, raw: string) => void;
  invalid?: boolean;
  placeholder?: string;
};

export const MaskedInput = React.forwardRef<HTMLInputElement, Props>(
  (
    { mask, value: controlledValue, defaultValue = '', onValueChange, placeholder, ...rest },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internal, setInternal] = React.useState(() => masks[mask](defaultValue));
    const display = isControlled ? masks[mask](controlledValue) : internal;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const raw = e.target.value;
      const formatted = masks[mask](raw);
      const stripped = formatted.replace(/\D/g, '');
      if (!isControlled) setInternal(formatted);
      onValueChange?.(formatted, stripped);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode={inputModes[mask]}
        maxLength={maxLengths[mask]}
        placeholder={placeholder ?? placeholders[mask]}
        autoComplete={mask === 'cep' ? 'postal-code' : mask === 'phone' ? 'tel' : 'off'}
        {...rest}
        value={display}
        onChange={handleChange}
      />
    );
  },
);
MaskedInput.displayName = 'MaskedInput';
