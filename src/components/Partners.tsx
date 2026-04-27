const groups = [
  {
    region: "Mauritius",
    accent: "ocean",
    items: ["The Residence", "One&Only Le Saint Géran", "Shangri-La Le Touessrok", "Lux Grand Baie", "Constance Prince Maurice"],
  },
  {
    region: "Tanzania",
    accent: "warm",
    items: ["Nomad Tanzania", "Elewana Collection", "andBeyond", "Foxes Safari Camps"],
  },
  {
    region: "Zambia",
    accent: "warm",
    items: ["Chiawa Safari", "Bushcamp Company", "Lower Zambezi lodges", "South Luangwa private camps"],
  },
  {
    region: "Kenya · Uganda · Ruanda",
    accent: "warm",
    items: ["Elewana (Kenya)", "Kuringo Safari Lodge (Uganda)", "Ruanda premium gorilla trekking partners"],
  },
];

const Partners = () => {
  return (
    <section id="partner" className="py-24 lg:py-32 bg-muted/40">
      <div className="container-narrow">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Benchmark & partner
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08]">
            Lavoriamo solo con chi ha senso davvero.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Una selezione corta e ragionata di lodge, camp e resort. Niente catalogo infinito: scegliamo dove ha senso
            mandare i nostri clienti, in funzione della stagione, dell'esperienza e del budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {groups.map((g) => (
            <div
              key={g.region}
              className="group bg-card rounded-2xl border border-border p-7 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-smooth"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-2xl font-medium text-foreground">{g.region}</h3>
                <span
                  className={`text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full ${
                    g.accent === "ocean" ? "bg-ocean/10 text-ocean-deep" : "bg-accent/10 text-accent"
                  }`}
                >
                  {g.accent === "ocean" ? "Oceano Indiano" : "Continente"}
                </span>
              </div>
              <ul className="space-y-2.5">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground/90">
                    <span
                      className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${
                        g.accent === "ocean" ? "bg-ocean" : "bg-accent"
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
