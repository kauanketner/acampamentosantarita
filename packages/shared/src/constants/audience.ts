export const ANNOUNCEMENT_AUDIENCES = [
  'todos',
  'participantes_evento',
  'equipistas',
  'tribo_x',
  'equipe_x',
] as const;
export type AnnouncementAudience = (typeof ANNOUNCEMENT_AUDIENCES)[number];

export const HOME_BLOCK_TYPES = [
  'hero',
  'call_to_action',
  'text',
  'gallery',
  'testimonial',
  'numbers',
] as const;
export type HomeBlockType = (typeof HOME_BLOCK_TYPES)[number];
