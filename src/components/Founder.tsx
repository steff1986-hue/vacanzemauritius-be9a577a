import { Quote } from "lucide-react";
import founderImg from "@/assets/Stefano_-_Marabou_Stork_-_Laikipia_-_HOAEXP.jpeg";
import logoHoae from "@/assets/logo-hoae.png";

const badges = ["Africa tailor made", "Safari + mare luxury", "17 destinazioni HOAEXP", "Progettazione umana"];

const Founder = () => {
  return (
    <section id="founder" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image / placeholder */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-elevated border-2 border-warm/20">
              <img
                src={founderImg}
                alt="Stefano Marra, Founder Heart of Africa Expedition in the field, Laikipia Kenya"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary via-primary/80 to-transparent px-6 py-6 text-white">
                <div className="font-display text-2xl font-medium leading-tight">Stefano Marra</div>
                <div className="text-sm text-white/80 uppercase tracking-[0.15em] mt-1">
                  Founder & Field Guide
                </div>
                <div className="mt-3 text-xs text-white/70">
                  17 stagioni di safari, relazioni dirette con 120+ lodge, progettazione umana.
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-4 lg:-right-10 w-32 h-32 rounded-full bg-gradient-to-br from-warm to-savanna grid place-items-center text-primary-foreground shadow-elevated rotate-12 hidden md:grid p-4 border-2 border-background">
              <img src={logoHoae} alt="Heart of Africa Expedition" className="w-full h-full object-contain" loading="lazy" />
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="eyebrow mb-5">
              <span className="hairline" /> Chi progetta
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08] text-balance">
              Non automazione.<br />
              <span className="italic font-normal text-accent">Lettura sul campo e scelte consapevoli.</span>
            </h2>

            <div className="mt-7 relative">
              <Quote className="absolute -left-2 -top-2 text-accent/30" size={36} />
              <p className="text-lg text-muted-foreground leading-relaxed pl-8">
                Stefano conosce ogni lodge non da catalogo, ma da stagioni di permanenza. Conosce i ranger senior, i tempi esatti di migrazione, come cambiano gli accessi con il meteo. Ogni viaggio che propone lo pensa come se dovesse farlo lui, con clienti che conosce e ama.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <div className="font-medium text-foreground">17 stagioni di safari</div>
                  <div className="text-sm text-muted-foreground">Dal 2008 sul continente africano, relazioni dirette con lodge e partner</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <div className="font-medium text-foreground">120+ lodge visitati</div>
                  <div className="text-sm text-muted-foreground">Selezione accurata, rapporti diretti, feedback reale da clienti</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Progettazione umana</div>
                  <div className="text-sm text-muted-foreground">Ogni proposta costruita con ascolto profondo, non da template</div>
                </div>
              </div>
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
