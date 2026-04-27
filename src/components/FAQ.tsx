import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Qual è il periodo migliore per una vacanza alle Mauritius?",
    a: "Da maggio a dicembre il clima è più asciutto e fresco, mentre da gennaio ad aprile è più caldo e umido con possibili piogge. Per chi abbina il safari, la finestra più forte è giugno–ottobre, in pieno con la stagione secca in Africa orientale.",
  },
  {
    q: "Ha senso abbinare un safari africano alle Mauritius?",
    a: "Sì, è il nostro posizionamento principale. Dopo l'intensità emotiva del safari, Mauritius diventa il finale perfetto: luce, mare, lentezza. È più esclusiva, raffinata e \"adulta\" della classica estensione Zanzibar.",
  },
  {
    q: "Meglio Tanzania, Kenya, Zambia, Uganda o Ruanda prima delle Mauritius?",
    a: "Dipende da te. Tanzania e Kenya per il primo safari ed equilibrio tra emozione e comfort. Zambia per chi conosce già l'Africa e cerca walking safari e qualità superiore. Uganda e Ruanda per gorilla trekking, foreste e viaggi più intensi.",
  },
  {
    q: "Mauritius è adatta solo ai viaggi di nozze?",
    a: "No. Funziona benissimo per honeymoon, ma anche per famiglie, adults only, golf, diving e wellness. È uno dei pochi paesi dell'Oceano Indiano con una vera offerta luxury per ogni tipologia di viaggiatore.",
  },
  {
    q: "Quanto deve durare un viaggio safari + Mauritius?",
    a: "In media 12–16 notti totali: 6–10 di safari più 4–6 alle Mauritius. Si può comprimere a 10–12 notti in versione breve o estendere a 18–20 per itinerari premium.",
  },
  {
    q: "Avete pacchetti standard?",
    a: "No. Ogni viaggio è costruito su misura: stagionalità, voli reali, lodge e resort effettivamente disponibili, ritmo del cliente. Niente pacchetto già pronto da scaricare.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-5">
              <span className="hairline" /> Domande frequenti
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08] text-balance">
              Le risposte più cercate sul viaggio.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Non trovi la tua domanda? Scrivici. Rispondiamo da persona a persona.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={i}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-lg lg:text-xl text-foreground group-hover:text-accent transition-smooth">
                        {f.q}
                      </span>
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full grid place-items-center transition-smooth ${
                          isOpen ? "bg-accent text-accent-foreground rotate-180" : "bg-muted text-foreground"
                        }`}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-500 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-muted-foreground leading-relaxed pr-12">{f.a}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
