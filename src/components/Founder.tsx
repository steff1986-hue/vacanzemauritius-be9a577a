import { Quote } from "lucide-react";
import founderImg from "@/assets/founder.jpg";
import logoHoae from "@/assets/logo-hoae.png";

const badges = ["Africa tailor made", "Safari + mare luxury", "17 destinazioni HOAEXP", "Progettazione umana"];

const Founder = () => {
  return (
    <section id="founder" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image / placeholder */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={founderImg}
                alt="Stefano Marra, Founder Heart of Africa Expedition"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 glass-dark text-white px-4 py-3 rounded-xl">
                <div className="font-display text-lg leading-tight">Stefano Marra</div>
                <div className="text-xs text-white/70 uppercase tracking-[0.2em]">
                  Founder · Heart of Africa Expedition
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-2 lg:-right-8 w-28 h-28 rounded-full bg-warm grid place-items-center text-primary-foreground shadow-elevated rotate-6 hidden md:grid">
              <span className="text-center text-[10px] uppercase tracking-[0.2em] leading-tight">
                Heart of<br />Africa<br />Expedition
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="eyebrow mb-5">
              <span className="hairline" /> Chi c'è dietro
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08] text-balance">
              Dietro la proposta non c'è un motore automatico.<br />
              <span className="italic font-normal text-accent">C'è una lettura reale del viaggio.</span>
            </h2>

            <div className="mt-7 relative">
              <Quote className="absolute -left-2 -top-2 text-accent/30" size={36} />
              <p className="text-lg text-muted-foreground leading-relaxed pl-8">
                Heart of Africa Expedition nasce dall'esperienza diretta sul continente africano. Itinerari costruiti
                sul campo, rapporti veri con partner locali, scelte fatte stagione per stagione, lodge per lodge.
                Quando ti propongo un viaggio, lo sto pensando come se dovessi farlo io.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-muted border border-border text-foreground/80"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
