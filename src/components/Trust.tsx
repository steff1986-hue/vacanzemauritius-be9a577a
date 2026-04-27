import { Star, Shield, Heart, Compass } from "lucide-react";

const trust = [
  { icon: Star, label: "TrustScore 4,5/5", sub: "Recensioni pubbliche HOAEXP" },
  { icon: Heart, label: "Recensioni 5 stelle", sub: "Esperienza memorabile" },
  { icon: Compass, label: "Tailor made", sub: "Nessun pacchetto standard" },
  { icon: Shield, label: "Safari + mare", sub: "Combinato sicuro e curato" },
];

const reviews = [
  {
    text: "Professionalità e ascolto vero. Hanno preso il nostro viaggio e l'hanno cucito addosso, senza forzarci nulla.",
    who: "Coppia · Tanzania + Mauritius",
  },
  {
    text: "Viaggio cucito sul cliente, dal primo brief fino al rientro. Ogni scelta aveva un senso, niente lasciato al caso.",
    who: "Honeymoon · Ruanda + Mauritius",
  },
  {
    text: "Assistenza e sicurezza sul posto, anche con cambi all'ultimo. Si sente che conoscono davvero le destinazioni.",
    who: "Famiglia · Kenya + Mauritius",
  },
];

const Trust = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container-narrow">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Trust & Recensioni
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08]">
            Quello che dicono di noi, in breve.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Sintesi delle recensioni pubbliche di Heart of Africa Expedition. Numeri indicativi, sempre verificabili.
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {trust.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="bg-card border border-border rounded-2xl p-5 text-center shadow-soft hover:shadow-elevated transition-smooth"
              >
                <Icon className="mx-auto text-accent mb-3" size={22} />
                <div className="font-display text-lg text-foreground">{t.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Review cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:-translate-y-1 transition-smooth"
            >
              <div className="flex gap-0.5 text-accent mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed">"{r.text}"</blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {r.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
