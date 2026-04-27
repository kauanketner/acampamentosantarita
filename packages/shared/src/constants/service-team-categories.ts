// TODO: a comunidade pode adicionar/renomear equipes via admin. Esta lista é o seed inicial.
export const SERVICE_TEAM_SEED = [
  'bem_estar',
  'cozinha',
  'logistica',
  'recreacao',
  'midia',
  'liturgia',
  'secretaria',
  'animacao',
] as const;
export type ServiceTeamSeed = (typeof SERVICE_TEAM_SEED)[number];

export const SERVICE_TEAM_FUNCTIONS = ['coordenador', 'vice_coordenador', 'membro'] as const;
export type ServiceTeamFunction = (typeof SERVICE_TEAM_FUNCTIONS)[number];
