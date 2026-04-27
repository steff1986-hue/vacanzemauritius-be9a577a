import { Mountain, Wind, FileSignature } from "lucide-react";

const cards = [
  {
    icon: Mountain,
    title: "Profondità",
    text: "Si parte dal continente africano vero — savana, foreste, primati, walking safari — non da una destinazione mare qualsiasi.",
  },
  {
    icon: Wind,
    title: "Respiro",
    text: "Mauritius diventa decompressione, luce, lentezza. Il momento in cui il viaggio si sedimenta dentro di te.",
  },
  {
    icon: FileSignature,
    title: "Proposta",
    text: "Nessun pacchetto preconfezionato. Itinerari cuciti su stagionalità, voli reali, lodge e resort effettivamente disponibili.",
  },
];

const Concept = () => {
  return (
    <section id="concept" className="relative py-24 lg:py-32 bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Il concept
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-medium text-foreground leading-[1.05] text-balance">
            Non vendiamo solo mare.<br />
            <span className="text-accent italic font-normal">Vendiamo il passaggio</span> dal remoto all'oceano.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Mauritius non è una cartolina luxury isolata. È il finale emotivo di un viaggio africano completo,
            il punto in cui l'intensità del safari si trasforma in luce, silenzio e mare.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <article
                key={c.title}
                className="group relative bg-card border border-border rounded-2xl p-7 lg:p-8 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-smooth"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-forest grid place-items-center text-primary-foreground mb-5 group-hover:scale-110 transition-smooth">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="font-display text-2xl font-medium text-foreground mb-3">{c.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.text}</p>
                <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Concept;
