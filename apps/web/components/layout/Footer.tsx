import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-24">
      <div className="container max-w-6xl py-12 px-6 grid gap-8 md:grid-cols-3 text-sm text-muted-foreground">
        <div>
          <p className="font-serif text-foreground text-lg mb-2">Acampamento Santa Rita</p>
          <p className="italic">Viva seu momento.</p>
        </div>
        <div className="space-y-1">
          {/* TODO: redes sociais, contato, endereço. */}
          <p>contato@acampamentosantarita.com.br</p>
        </div>
        <div className="space-y-1">
          <Link href="/politica-de-privacidade" className="block hover:text-foreground">
            Política de privacidade
          </Link>
          <Link href="/termos-de-uso" className="block hover:text-foreground">
            Termos de uso
          </Link>
        </div>
      </div>
    </footer>
  );
}
