type Props = { title?: string };

export function TopBar({ title }: Props) {
  return (
    <header className="h-14 border-b bg-card flex items-center px-4 sticky top-0 z-10">
      <h1 className="font-serif text-lg flex-1">{title ?? 'Santa Rita'}</h1>
      {/* TODO: botão de busca / notificações conforme contexto. */}
    </header>
  );
}
