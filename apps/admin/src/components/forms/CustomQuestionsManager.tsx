import { useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  type CustomQuestion,
  type CustomQuestionAudience,
  type CustomQuestionInput,
  type CustomQuestionType,
  useAddCustomQuestion,
  useCustomQuestions,
  useDeleteCustomQuestion,
  useUpdateCustomQuestion,
} from '@/lib/queries/events';

const TYPES: { value: CustomQuestionType; label: string; needsOptions?: boolean }[] = [
  { value: 'text', label: 'Texto curto' },
  { value: 'textarea', label: 'Texto longo' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'bool', label: 'Sim / Não' },
  { value: 'select', label: 'Seleção única', needsOptions: true },
  { value: 'multi_select', label: 'Múltipla escolha', needsOptions: true },
];

const AUDIENCES: { value: CustomQuestionAudience; label: string }[] = [
  { value: 'ambos', label: 'Campistas e equipistas' },
  { value: 'campista', label: 'Só campistas' },
  { value: 'equipista', label: 'Só equipistas' },
];

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export function CustomQuestionsManager({ eventId }: { eventId: string }) {
  const { data: questions, isLoading } = useCustomQuestions(eventId);
  const add = useAddCustomQuestion(eventId);
  const remove = useDeleteCustomQuestion(eventId);
  const update = useUpdateCustomQuestion(eventId);
  const [creating, setCreating] = useState(false);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }

  return (
    <div className="space-y-3">
      {questions && questions.length === 0 && !creating && (
        <p className="text-sm text-muted-foreground">
          Nenhuma pergunta customizada. Você pode adicionar agora ou depois.
        </p>
      )}

      {questions?.map((q) => (
        <QuestionRow
          key={q.id}
          question={q}
          onUpdate={async (input) => {
            try {
              await update.mutateAsync({ id: q.id, input });
            } catch (err) {
              alert(
                err instanceof ApiError
                  ? err.message
                  : 'Não foi possível atualizar.',
              );
            }
          }}
          onDelete={async () => {
            if (!confirm('Excluir esta pergunta?')) return;
            try {
              await remove.mutateAsync(q.id);
            } catch (err) {
              alert(
                err instanceof ApiError
                  ? err.message
                  : 'Não foi possível excluir.',
              );
            }
          }}
        />
      ))}

      {creating ? (
        <NewQuestionForm
          orderHint={(questions?.length ?? 0) + 1}
          submitting={add.isPending}
          onCancel={() => setCreating(false)}
          onSubmit={async (input) => {
            try {
              await add.mutateAsync(input);
              setCreating(false);
            } catch (err) {
              alert(
                err instanceof ApiError ? err.message : 'Não foi possível salvar.',
              );
            }
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md border border-dashed px-4 py-2 text-sm w-full hover:bg-secondary/30"
        >
          + Adicionar pergunta
        </button>
      )}
    </div>
  );
}

function QuestionRow({
  question,
  onUpdate,
  onDelete,
}: {
  question: CustomQuestion;
  onUpdate: (input: Partial<CustomQuestionInput>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const typeLabel = TYPES.find((t) => t.value === question.type)?.label;
  const audienceLabel = AUDIENCES.find((a) => a.value === question.appliesTo)?.label;

  if (editing) {
    return (
      <NewQuestionForm
        initial={question}
        orderHint={question.order}
        submitting={false}
        onCancel={() => setEditing(false)}
        onSubmit={async (input) => {
          await onUpdate(input);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="rounded-md border bg-background p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">
          {question.question}
          {question.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {typeLabel} · {audienceLabel}
          {question.options?.options && question.options.options.length > 0 && (
            <> · {question.options.options.length} opções</>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-primary underline"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-destructive underline"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

function NewQuestionForm({
  initial,
  orderHint,
  submitting,
  onCancel,
  onSubmit,
}: {
  initial?: CustomQuestion;
  orderHint: number;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (input: CustomQuestionInput) => Promise<void>;
}) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [type, setType] = useState<CustomQuestionType>(initial?.type ?? 'text');
  const [appliesTo, setAppliesTo] = useState<CustomQuestionAudience>(
    initial?.appliesTo ?? 'ambos',
  );
  const [required, setRequired] = useState(initial?.required ?? false);
  const [optionsText, setOptionsText] = useState(
    initial?.options?.options
      ?.map((o) => `${o.value}|${o.label}`)
      .join('\n') ?? '',
  );

  const needsOptions = type === 'select' || type === 'multi_select';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 2) return;

    let optionsObj: CustomQuestionInput['options'] = null;
    if (needsOptions) {
      const parsed = optionsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [value, label] = line.split('|').map((s) => s.trim());
          return value && label
            ? { value, label }
            : value
              ? { value, label: value }
              : null;
        })
        .filter((x): x is { value: string; label: string } => x !== null);
      if (parsed.length === 0) {
        alert('Adicione pelo menos uma opção (formato: valor|rótulo).');
        return;
      }
      optionsObj = { options: parsed };
    }

    await onSubmit({
      question: question.trim(),
      type,
      appliesTo,
      required,
      order: orderHint,
      options: optionsObj,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border bg-secondary/20 p-4 space-y-3"
    >
      <label className="block">
        <span className="text-sm font-medium">Pergunta</span>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: Por que você quer servir nesta edição?"
          className={`mt-1 ${inputClass}`}
          required
          autoFocus
        />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CustomQuestionType)}
            className={`mt-1 ${inputClass}`}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Quem responde</span>
          <select
            value={appliesTo}
            onChange={(e) =>
              setAppliesTo(e.target.value as CustomQuestionAudience)
            }
            className={`mt-1 ${inputClass}`}
          >
            {AUDIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {needsOptions && (
        <label className="block">
          <span className="text-sm font-medium">Opções</span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            Uma por linha, no formato <code>valor|rótulo</code>. Ex:{' '}
            <code>cozinha|Cozinha</code>
          </span>
          <textarea
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            rows={4}
            className={`mt-1 ${inputClass} font-mono`}
            placeholder={'cozinha|Cozinha\nbem_estar|Bem-estar\nmidia|Mídia'}
          />
        </label>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        Resposta obrigatória
      </label>
      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting || question.trim().length < 2}
          className="rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? 'Salvando…' : initial ? 'Salvar' : 'Adicionar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground underline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
