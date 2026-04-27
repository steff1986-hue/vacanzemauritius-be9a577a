const tiers = [
  {
    label: "Mauritius Tailor Made",
    range: "€2.500 – €4.500",
    sub: "a persona",
    detail: "Solo Mauritius, resort selezionati, durata su misura.",
    accent: "ocean",
  },
  {
    label: "Safari breve + Mauritius",
    range: "€4.800 – €7.500",
    sub: "a persona",
    detail: "5–7 notti di safari + 4–5 notti alle Mauritius.",
    accent: "warm",
  },
  {
    label: "Safari premium + Mauritius",
    range: "€7.500+",
    sub: "a persona",
    detail: "Safari lungo o remoto, lodge top, finale Mauritius alto di gamma.",
    accent: "forest",
  },
];

const Budget = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Budget indicativo
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08]">
            Tre fasce, per orientarti subito.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.label}
              className="relative overflow-hidden bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-smooth"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  t.accent === "ocean" ? "bg-ocean" : t.accent === "forest" ? "bg-forest" : "bg-warm"
                }`}
              />
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t.label}</div>
              <div className="font-display text-3xl lg:text-4xl font-medium text-foreground">{t.range}</div>
              <div className="text-sm text-accent mb-4">{t.sub}</div>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.detail}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground italic max-w-3xl">
          Cifre puramente orientative. Il prezzo reale dipende da stagionalità, voli, disponibilità,
          durata del safari, lodge e resort selezionati.
        </p>
      </div>
    </section>
  );
};

export default Budget;
