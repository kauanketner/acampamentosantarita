import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { maskPhoneDisplay } from '@/lib/format';
import {
  type AdminPersonRow,
  type AdminRole,
  useAdminPersons,
} from '@/lib/queries/persons';

export const Route = createFileRoute('/_app/pessoas/')({
  component: PessoasIndex,
});

const roleLabel: Record<AdminRole, string> = {
  admin: 'Admin',
  equipe_acampamento: 'Equipe',
  tesouraria: 'Tesouraria',
  comunicacao: 'Comunicação',
  participante: 'Participante',
};

const roleClass: Record<AdminRole, string> = {
  admin:
    'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
  equipe_acampamento:
    'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  tesouraria:
    'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
  comunicacao:
    'bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-200 dark:border-sky-800',
  participante: 'bg-secondary text-secondary-foreground border-border',
};

function PessoasIndex() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useAdminPersons(
    search.length >= 2 ? search : undefined,
  );

  return (
    <div className="p-6 space-y-5 max-w-6xl">
      <header>
        <h1 className="font-serif text-2xl">Pessoas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Diretório de campistas, equipistas, líderes e administradores.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, CPF ou telefone (mín. 2 letras)"
          className="flex-1 min-w-[260px] rounded-md border bg-background px-3 py-1.5 text-sm"
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar.
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">
            {search.length >= 2
              ? 'Nenhuma pessoa encontrada'
              : 'Nenhuma pessoa cadastrada'}
          </p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Pessoas são criadas automaticamente quando alguém se cadastra pelo app
            campista.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Contato</th>
                <th className="px-4 py-3 font-medium">Cidade</th>
                <th className="px-4 py-3 font-medium">Função</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {data?.length ?? 0} pessoa{(data?.length ?? 0) === 1 ? '' : 's'} listada
        {(data?.length ?? 0) === 1 ? '' : 's'}.
        {search.length < 2 && ' Refine com a busca pra mais.'}
      </p>
    </div>
  );
}

function PersonRow({ person }: { person: AdminPersonRow }) {
  const role = person.user?.role;
  return (
    <tr className="border-b last:border-b-0 hover:bg-secondary/30 transition">
      <td className="px-4 py-3">
        <Link to="/pessoas/$id" params={{ id: person.id }} className="block">
          <p className="font-medium leading-tight">{person.fullName}</p>
          {person.cpf && (
            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
              CPF {person.cpf}
            </p>
          )}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <p>{person.mobilePhone ? maskPhoneDisplay(person.mobilePhone) : '—'}</p>
        {person.user?.email && (
          <p className="text-[11px] text-muted-foreground/80 mt-0.5">
            {person.user.email}
          </p>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {person.city ?? '—'}
        {person.state && `/${person.state}`}
      </td>
      <td className="px-4 py-3">
        {role ? (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${roleClass[role]}`}
          >
            {roleLabel[role]}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">sem login</span>
        )}
      </td>
    </tr>
  );
}
