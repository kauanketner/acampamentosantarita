import { closeDb, getDb } from './client.ts';

// TODO: popular dados iniciais:
// - usuário admin padrão
// - equipes de serviço seed (bem_estar, cozinha, logística, ...)
// - blocos da home do site
// - FAQ inicial
// - perguntas customizadas padrão

async function seed() {
  const db = getDb();
  // TODO: inserts
  void db;
  console.log('seed: nada implementado ainda');
}

await seed();
await closeDb();
