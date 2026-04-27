export default function HomePage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center space-y-8">
        {/* TODO: hero contemplativo — imagem de fundo, frase curta, sem revelar dinâmicas. */}
        <p className="font-serif italic text-xl text-muted-foreground">
          {/* placeholder do tom: silêncio, presença, convite. */}
          Viva seu momento.
        </p>
        <h1 className="text-4xl md:text-6xl font-serif">Acampamento Santa Rita</h1>
        {/* TODO: blocos vindos do CMS (home_blocks): hero, números, depoimentos, gallery, CTA. */}
      </div>
    </section>
  );
}
