# Status dos Módulos

Legenda: 🔲 Estrutura criada · 🟡 Em implementação · ✅ Pronto

## Backend (services/api)

- 🔲 auth (login, registro 1ª vez, registro veterano, sessão)
- 🔲 persons (CRUD do cadastro central)
- 🔲 health (perfil de saúde)
- 🔲 faith (vida de fé)
- 🔲 camp-history (histórico legado de acampamentos)
- 🔲 events (CRUD + perguntas customizadas)
- 🔲 registrations (inscrições + aprovação + check-in)
- 🔲 tribes (gestão de tribos por evento + revelação)
- 🔲 service-teams (equipes de serviço)
- 🔲 finance (faturas, pagamentos, reembolsos, integração Asaas)
- 🔲 pos (PDV interno: cantina/lojinha durante eventos)
- 🔲 shop (catálogo lojinha do site → WhatsApp)
- 🔲 communication (avisos, push, notificações)
- 🔲 cms (páginas, posts, galeria, FAQ, blocos da home)
- 🔲 reports
- 🔲 webhooks (Asaas)
- 🔲 public (endpoints consumidos pelo site)

## Admin (apps/admin)

- 🔲 Dashboard
- 🔲 Pessoas (lista + perfil completo)
- 🔲 Eventos (CRUD + wizard + perguntas customizadas)
- 🔲 Inscrições (geral + por evento)
- 🔲 Tribos (gestão por evento)
- 🔲 Equipes de Serviço
- 🔲 Financeiro (faturas, pagamentos, reembolsos, fluxo)
- 🔲 PDV (itens + contas abertas)
- 🔲 Lojinha do Site
- 🔲 Comunicação (avisos + push)
- 🔲 Site/CMS (home, páginas, posts, galeria, FAQ)
- 🔲 Relatórios
- 🔲 Configurações (usuários, permissões, integrações, auditoria)

## App PWA (apps/app)

- 🔲 Login
- 🔲 Cadastro 1ª vez (5 passos)
- 🔲 Cadastro veterano (6 passos com histórico legado)
- 🔲 Home
- 🔲 Eventos (lista, detalhe, fluxo de inscrição + pagamento)
- 🔲 Minhas Inscrições
- 🔲 Financeiro (extrato + faturas + PDV do evento atual)
- 🔲 Tribo (revelação pós-evento)
- 🔲 Avisos
- 🔲 Galeria
- 🔲 FAQ
- 🔲 Perfil (dados, saúde, fé, histórico, notificações)

## Site (apps/web)

- 🔲 Home (discreta, contemplativa)
- 🔲 Sobre
- 🔲 Eventos (lista pública)
- 🔲 Eventos detalhe
- 🔲 Blog
- 🔲 Galeria
- 🔲 Lojinha (catálogo → WhatsApp)
- 🔲 FAQ
- 🔲 Contato
- 🔲 Páginas legais

## Integrações

- 🔲 Better Auth
- 🔲 Asaas (cobrança + webhook)
- 🔲 Cloudflare R2 (uploads)
- 🔲 Resend (email transacional)
- 🔲 Web Push (VAPID)

## Infra

- 🔲 docker-compose dev (postgres + 4 serviços)
- 🔲 4 Dockerfiles multi-stage (api/web/admin/app)
- 🔲 CI (lint + typecheck)
