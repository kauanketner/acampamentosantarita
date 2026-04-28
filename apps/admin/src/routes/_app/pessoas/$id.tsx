import { formatDate, maskPhoneDisplay } from '@/lib/format';
import { useAdminPersonFull } from '@/lib/queries/persons';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pessoas/$id')({
  component: PessoaDetalhe,
});

function PessoaDetalhe() {
  const { id } = Route.useParams();
  const { data, isLoading, isError } = useAdminPersonFull(id);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }
  if (isError || !data) {
    return (
      <div className="p-6">
        <p className="font-serif text-2xl">Pessoa não encontrada.</p>
        <Link to="/pessoas" className="text-sm text-primary underline">
          Voltar
        </Link>
      </div>
    );
  }

  const { person, contacts, sacraments, participations } = data;
  const health = data.health as Record<string, unknown> | null;
  const faith = data.faith as Record<string, unknown> | null;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <header className="space-y-2">
        <Link to="/pessoas" className="text-xs text-muted-foreground hover:text-foreground">
          ← Pessoas
        </Link>
        <h1 className="font-serif text-2xl">{person.fullName}</h1>
        <p className="text-sm text-muted-foreground">
          {person.mobilePhone ? maskPhoneDisplay(person.mobilePhone) : '—'}
          {person.city && ` · ${person.city}`}
          {person.state && `/${person.state}`}
        </p>
      </header>

      <Section title="Dados pessoais">
        <Field label="CPF" value={person.cpf ?? '—'} mono />
        <Field label="Nascimento" value={person.birthDate ? formatDate(person.birthDate) : '—'} />
        <Field
          label="Gênero"
          value={
            person.gender === 'masculino'
              ? 'Masculino'
              : person.gender === 'feminino'
                ? 'Feminino'
                : '—'
          }
        />
        <Field label="Camiseta" value={person.shirtSize ?? '—'} />
      </Section>

      <Section title="Endereço">
        <Field
          label="Logradouro"
          value={[person.street, person.addressNumber].filter(Boolean).join(', ') || '—'}
        />
        <Field label="Bairro" value={person.neighborhood ?? '—'} />
        <Field label="CEP" value={person.zipCode ?? '—'} mono />
        <Field
          label="Cidade/UF"
          value={person.city ? `${person.city}${person.state ? `/${person.state}` : ''}` : '—'}
        />
      </Section>

      <Section title="Contatos de emergência">
        {contacts.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum.</p>
        ) : (
          <ul className="grid gap-2">
            {contacts.map((c) => (
              <li key={c.id} className="rounded-md border bg-background p-3 text-sm">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.relationship} · {maskPhoneDisplay(c.phone)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {health && (
        <Section title="Saúde">
          <p className="text-xs text-muted-foreground col-span-full mb-2">
            Confidencial — equipe de cuidado.
          </p>
          <Field
            label="Doença crônica"
            value={
              (health.hasChronicDisease as boolean | undefined)
                ? ((health.chronicDiseaseDetail as string | null) ?? 'Sim')
                : 'Não'
            }
          />
          <Field
            label="Alergia"
            value={
              (health.hasAllergy as boolean | undefined)
                ? ((health.allergyDetail as string | null) ?? 'Sim')
                : 'Não'
            }
          />
          <Field
            label="Restrição alimentar"
            value={
              (health.hasDietaryRestriction as boolean | undefined)
                ? ((health.dietaryRestrictionDetail as string | null) ?? 'Sim')
                : 'Não'
            }
          />
          <Field
            label="Medicação contínua"
            value={(health.continuousMedications as string | null) ?? 'Nenhuma'}
          />
          <Field
            label="Plano de saúde"
            value={(health.healthInsuranceName as string | null) ?? '—'}
          />
          <Field
            label="Última revisão"
            value={health.lastReviewedAt ? formatDate(health.lastReviewedAt as string) : '—'}
          />
        </Section>
      )}

      {(faith || sacraments.length > 0) && (
        <Section title="Vida de fé">
          <Field label="Religião" value={(faith?.religion as string | null) ?? '—'} />
          <Field label="Paróquia" value={(faith?.parish as string | null) ?? '—'} />
          <Field label="Grupo / pastoral" value={(faith?.groupName as string | null) ?? '—'} />
          <Field
            label="Sacramentos"
            value={
              sacraments.length > 0
                ? sacraments
                    .map((s) => (s === 'uncao_enfermos' ? 'Unção dos enfermos' : s))
                    .join(', ')
                : '—'
            }
            wide
          />
        </Section>
      )}

      {participations.length > 0 && (
        <Section title="Histórico de acampamentos">
          <ul className="col-span-full grid gap-2">
            {participations.map((p) => (
              <li
                key={p.id}
                className="rounded-md border bg-background p-3 text-sm flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium">
                    {p.campEdition}º acampamento {p.campYear ? `· ${p.campYear}` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {p.role === 'lider'
                      ? 'Líder'
                      : p.role === 'equipista'
                        ? 'Equipista'
                        : 'Campista'}
                    {p.tribeNameLegacy && ` · ${p.tribeNameLegacy}`}
                    {p.serviceTeam && ` · ${p.serviceTeam}`}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {p.isLegacy ? 'legado' : 'sistema'}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <p className="text-xs text-muted-foreground pt-2">
        Cadastro: {formatDate(person.createdAt)}
        {' · Última atualização: '}
        {formatDate(person.updatedAt)}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-serif text-lg mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  mono,
  wide,
}: {
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'col-span-full' : ''}>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-sm mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
