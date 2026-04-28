import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Badge, type Tone } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Toolbar, ToolbarSearch } from '@/components/ui/Toolbar';
import { Table, THead, TH, TBody, TR, TD } from '@/components/ui/Table';
import { maskPhoneDisplay } from '@/lib/format';
import {
  type AdminPersonRow,
  type AdminRole,
  useAdminPersons,
} from '@/lib/queries/persons';

export const Route = createFileRoute('/_app/pessoas/')({
  component: PessoasIndex,
});

const roleInfo: Record<AdminRole, { label: string; tone: Tone }> = {
  admin: { label: 'Admin', tone: 'danger' },
  equipe_acampamento: { label: 'Equipe', tone: 'warning' },
  tesouraria: { label: 'Tesouraria', tone: 'success' },
  comunicacao: { label: 'Comunicação', tone: 'info' },
  participante: { label: 'Participante', tone: 'neutral' },
};

function PessoasIndex() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useAdminPersons(
    search.length >= 2 ? search : undefined,
  );

  return (
    <div className="px-8 py-8 max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Operação · Diretório"
        title="Pessoas"
        description="Campistas, equipistas, líderes e administradores. Cadastros vêm do app dos campistas — aqui é o lugar de consulta."
      />

      <Toolbar>
        <ToolbarSearch
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, CPF ou telefone (mín. 2 letras)…"
        />
      </Toolbar>

      {isLoading && (
        <p className="text-sm text-(color:--color-muted-foreground)">
          Carregando…
        </p>
      )}

      {isError && (
        <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) px-4 py-3 text-sm text-(color:--color-danger)">
          Não conseguimos buscar.
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={
            <svg viewBox="0 0 36 36" fill="none" className="size-9" aria-hidden>
              <circle cx="18" cy="13" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M6 30c2-6 7-9 12-9s10 3 12 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          }
          title={
            search.length >= 2
              ? 'Nenhuma pessoa encontrada'
              : 'Comece buscando por nome ou telefone'
          }
          description={
            search.length >= 2
              ? 'Tente outro nome, parte do CPF ou só os primeiros dígitos do telefone.'
              : 'Pessoas são criadas automaticamente quando alguém se cadastra pelo app dos campistas. Use a busca acima pra localizar.'
          }
        />
      )}

      {data && data.length > 0 && (
        <Table>
          <THead>
            <tr>
              <TH>Nome</TH>
              <TH>Contato</TH>
              <TH>Cidade</TH>
              <TH>Função</TH>
            </tr>
          </THead>
          <TBody>
            {data.map((p) => (
              <PersonRow key={p.id} person={p} />
            ))}
          </TBody>
        </Table>
      )}

      <p className="text-[11px] text-(color:--color-muted-foreground)">
        {data?.length ?? 0} pessoa{(data?.length ?? 0) === 1 ? '' : 's'} listada
        {(data?.length ?? 0) === 1 ? '' : 's'}.
        {search.length < 2 && ' Refine com a busca pra mais resultados.'}
      </p>
    </div>
  );
}

function PersonRow({ person }: { person: AdminPersonRow }) {
  const role = person.user?.role;
  return (
    <TR>
      <TD>
        <Link to="/pessoas/$id" params={{ id: person.id }} className="block group">
          <p className="font-medium leading-tight group-hover:text-(color:--color-primary) transition-colors">
            {person.fullName}
          </p>
          {person.cpf && (
            <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5 font-mono tabular-nums">
              CPF {person.cpf}
            </p>
          )}
        </Link>
      </TD>
      <TD className="text-(color:--color-muted-foreground)">
        <p className="font-mono tabular-nums">
          {person.mobilePhone ? maskPhoneDisplay(person.mobilePhone) : '—'}
        </p>
        {person.user?.email && (
          <p className="text-[11px] text-(color:--color-subtle) mt-0.5">
            {person.user.email}
          </p>
        )}
      </TD>
      <TD className="text-(color:--color-muted-foreground)">
        {person.city ?? '—'}
        {person.state && (
          <span className="text-(color:--color-subtle)">/{person.state}</span>
        )}
      </TD>
      <TD>
        {role ? (
          <Badge tone={roleInfo[role].tone} dot={role === 'admin'}>
            {roleInfo[role].label}
          </Badge>
        ) : (
          <span className="text-[11px] text-(color:--color-subtle)">sem login</span>
        )}
      </TD>
    </TR>
  );
}
