import { ArrowUpRight, Compass, Waves } from "lucide-react";
import safariImg from "@/assets/walking-safari.jpg";
import resortImg from "@/assets/mauritius-resort.jpg";

const Products = () => {
  return (
    <section id="prodotti" className="relative py-24 lg:py-32 bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl mb-14">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Prodotti
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08]">
            Due modi per vivere le Mauritius con noi.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Safari + Mauritius */}
          <article className="group relative overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-elevated">
            <div className="relative h-72 overflow-hidden">
              <img
                src={safariImg}
                alt="Walking safari nella savana africana"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium">
                <Compass size={12} /> Combinato
              </div>
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="font-display text-3xl lg:text-4xl font-medium">Safari + Mauritius</h3>
              <p className="mt-4 text-primary-foreground/85 leading-relaxed">
                Africa profonda prima, mare luxury dopo. Ingresso dal continente — Tanzania, Kenya, Zambia, Uganda o Ruanda
                — e finale alle Mauritius in resort selezionato.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
                {["Honeymoon", "Anniversari", "Coppie premium", "Repeaters Africa"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-primary-foreground/85">
                    <span className="w-1 h-1 rounded-full bg-aqua" /> {t}
                  </li>
                ))}
              </ul>
              <a
                href="#mappa"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-smooth"
              >
                Apri la mappa <ArrowUpRight size={16} />
              </a>
            </div>
          </article>

          {/* Mauritius Tailor Made */}
          <article className="group relative overflow-hidden rounded-3xl bg-ocean text-white shadow-ocean">
            <div className="relative h-72 overflow-hidden">
              <img
                src={resortImg}
                alt="Resort luxury alle Mauritius al tramonto"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/40 to-transparent" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-celeste text-ocean-deep px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium">
                <Waves size={12} /> Tailor Made
              </div>
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="font-display text-3xl lg:text-4xl font-medium">Mauritius Tailor Made</h3>
              <p className="mt-4 text-white/85 leading-relaxed">
                Solo Mauritius, ma cucita su di te. Resort selezionati, attività marine, wellness, golf, diving.
                Nessun pacchetto standard, solo l'isola scelta sul tuo viaggio.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
                {["Family", "Adults only", "Wellness", "Diving & Golf"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-white/85">
                    <span className="w-1 h-1 rounded-full bg-celeste" /> {t}
                  </li>
                ))}
              </ul>
              <a
                href="#richiesta"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-ocean-deep px-6 py-3 text-sm font-medium hover:bg-celeste transition-smooth"
              >
                Costruisci la tua Mauritius <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Products;
