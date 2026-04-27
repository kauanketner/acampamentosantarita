import { Link, createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, ChevronDown, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Field } from '@/components/form/Field';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioCard, RadioGroup } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { brl, events } from '@/mock/data';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/')({
  component: InscricaoForm,
});

function InscricaoForm() {
  const { slug } = Route.useParams();
  const event = events.find((e) => e.slug === slug);
  const [role, setRole] = useState<'campista' | 'equipista' | ''>('');
  const [healthOpen, setHealthOpen] = useState(false);

  if (!event) return null;

  const price =
    role === 'campista' ? event.priceCampista : role === 'equipista' ? event.priceEquipista : 0;

  return (
    <Page withBottomNav={false}>
      <TopBar back={`/eventos/${slug}`} title="Inscrição" border />

      <div className="px-5 pt-4 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {event.editionNumber ? `${event.editionNumber}º acampamento` : event.name}
        </p>
        <h1
          className="font-display text-[clamp(1.7rem,7vw,2.1rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Sua inscrição.
        </h1>
        <p className="mt-2 text-[15px] text-(color:--color-muted-foreground) leading-relaxed">
          Três passos antes do pagamento.
        </p>
      </div>

      {/* Step 1 — papel */}
      <SectionTitle>1 · Como você participa</SectionTitle>
      <div className="px-5">
        <RadioGroup
          value={role}
          onValueChange={(v) => setRole(v as typeof role)}
          className="grid gap-2.5"
        >
          {event.allowFirstTimer && (
            <RadioCard value="campista" checked={role === 'campista'}>
              <p className="font-medium">Como campista</p>
              <p className="text-xs text-(color:--color-muted-foreground) mt-0.5 leading-snug">
                Para quem vive este Santa Rita pela primeira vez. Vagas limitadas.
              </p>
              {event.priceCampista !== undefined && (
                <p className="font-mono text-[11px] mt-2 text-(color:--color-foreground)">
                  {brl(event.priceCampista)}
                </p>
              )}
            </RadioCard>
          )}
          <RadioCard value="equipista" checked={role === 'equipista'}>
            <p className="font-medium">Como equipista</p>
            <p className="text-xs text-(color:--color-muted-foreground) mt-0.5 leading-snug">
              Você serve em uma das equipes. Reunião de equipe é obrigatória.
            </p>
            {event.priceEquipista !== undefined && (
              <p className="font-mono text-[11px] mt-2 text-(color:--color-foreground)">
                {brl(event.priceEquipista)}
              </p>
            )}
          </RadioCard>
        </RadioGroup>
      </div>

      {/* Step 2 — health review */}
      <SectionTitle>2 · Revisão de saúde</SectionTitle>
      <div className="px-5">
        <Card>
          <button
            type="button"
            onClick={() => setHealthOpen((v) => !v)}
            className="w-full flex items-start gap-3 p-4 text-left"
          >
            <div className="size-9 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[15px]">Revise suas respostas</p>
              <p className="text-xs text-(color:--color-muted-foreground) mt-0.5 leading-snug">
                Última atualização há 14 dias. Confirme se nada mudou.
              </p>
            </div>
            <ChevronDown
              className={cn(
                'size-5 mt-2 shrink-0 text-(color:--color-muted-foreground) transition-transform',
                healthOpen && 'rotate-180',
              )}
              strokeWidth={1.5}
            />
          </button>
          {healthOpen && (
            <CardBody className="border-t border-(color:--color-border) pt-4">
              <ul className="grid gap-2.5">
                <ReviewRow label="Doença crônica" value="Não" />
                <ReviewRow label="Alergia" value="Sim — penicilina" highlight />
                <ReviewRow label="Restrição alimentar" value="Sim — vegetariana" highlight />
                <ReviewRow label="Medicação contínua" value="Levotiroxina 50mcg, jejum" />
              </ul>
              <Button asChild variant="link" size="sm" className="mt-3 -ml-2">
                <Link to="/perfil/saude">
                  <Pencil className="size-3.5" /> Atualizar perfil de saúde
                </Link>
              </Button>
            </CardBody>
          )}
        </Card>
      </div>

      {/* Step 3 — custom questions */}
      <SectionTitle>3 · Perguntas do evento</SectionTitle>
      <div className="px-5 grid gap-4">
        <Field
          label={<Label>Por que você quer servir nesta edição?</Label>}
          hint="Resposta livre. Conte do seu jeito."
        >
          <Textarea placeholder="Algumas linhas bastam." className="min-h-28" />
        </Field>
        <Field
          label={<Label>Em qual equipe você gostaria de servir?</Label>}
          hint="A equipe final é decidida pelo time de coordenação."
        >
          <Input placeholder="Cozinha, bem-estar, mídia…" />
        </Field>
      </div>

      <div className="px-5 mt-6">
        <Separator variant="ornament" />
      </div>

      {/* Total + CTA */}
      <div className="px-5 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-sm text-(color:--color-muted-foreground)">Total</p>
          <p
            className="font-display text-3xl tracking-tight"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
          >
            {price ? brl(price) : '—'}
          </p>
        </div>
        <Button asChild block size="lg" disabled={!role}>
          <Link to="/eventos/$slug/inscricao/pagamento" params={{ slug }}>
            Continuar para pagamento
          </Link>
        </Button>
      </div>
    </Page>
  );
}

function ReviewRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-sm text-(color:--color-muted-foreground)">{label}</span>
      <span
        className={cn(
          'text-[14px] font-medium text-right text-pretty',
          highlight && 'text-(color:--color-primary)',
        )}
      >
        {value}
      </span>
    </li>
  );
}
