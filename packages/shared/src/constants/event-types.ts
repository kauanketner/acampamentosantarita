export const EVENT_TYPES = ['acampamento', 'retiro', 'encontro', 'formacao', 'outro'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_STATUSES = [
  'rascunho',
  'inscricoes_abertas',
  'inscricoes_fechadas',
  'em_andamento',
  'finalizado',
  'cancelado',
] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const CUSTOM_QUESTION_TYPES = [
  'text',
  'textarea',
  'select',
  'multi_select',
  'bool',
  'number',
  'date',
] as const;
export type CustomQuestionType = (typeof CUSTOM_QUESTION_TYPES)[number];

export const CUSTOM_QUESTION_AUDIENCES = ['campista', 'equipista', 'ambos'] as const;
export type CustomQuestionAudience = (typeof CUSTOM_QUESTION_AUDIENCES)[number];
