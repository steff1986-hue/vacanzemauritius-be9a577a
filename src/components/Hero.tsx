import { ArrowRight, Compass, Waves } from "lucide-react";
import heroImg from "@/assets/hero-savanna-ocean.jpg";
import leopardImg from "@/assets/safari-leopard.jpg";
import lagoonImg from "@/assets/mauritius-lagoon.jpg";

const Hero = () => {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background image with slow zoom */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Savana africana che sfuma nell'Oceano Indiano delle Mauritius"
          className="w-full h-full object-cover animate-slow-zoom"
          fetchPriority="high"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-ocean-deep/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-narrow flex flex-col justify-end min-h-[100svh] pb-20 pt-32 lg:pt-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full glass-dark text-white/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse-dot" />
            Heart of Africa Expedition · vacanzemauritius.it
          </div>

          <h1 className="font-display text-white text-[2.6rem] sm:text-5xl lg:text-7xl font-medium leading-[1.02] text-balance animate-fade-in-slow">
            Mauritius non è la fine del viaggio.
            <span className="block italic font-normal text-celeste mt-2">È il finale perfetto.</span>
          </h1>

          <p className="mt-7 text-white/85 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed animate-fade-in-slow [animation-delay:200ms]">
            Prima l'Africa vera — savana, gorilla, walking safari nelle riserve più remote.
            Poi l'Oceano Indiano: luce, resort selezionati, tempo per lasciar sedimentare il viaggio.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fade-in-slow [animation-delay:400ms]">
            <a
              href="#mappa"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-accent text-accent-foreground px-7 py-4 text-sm font-medium shadow-elevated hover:bg-accent/90 hover:scale-[1.02] transition-smooth"
            >
              <Compass size={18} />
              Scegli il safari di partenza
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#prodotti"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full glass-dark text-white border border-white/25 px-7 py-4 text-sm font-medium hover:border-white/60 transition-smooth"
            >
              <Waves size={18} />
              Scopri anche Mauritius pura
            </a>
          </div>
        </div>

        {/* Floating image collage */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-[320px]">
          <div className="relative h-[460px]">
            <div className="absolute top-0 right-12 w-44 h-60 rounded-2xl overflow-hidden shadow-elevated animate-float ring-1 ring-white/20">
              <img src={leopardImg} alt="Leopardo nella savana al tramonto" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute bottom-0 right-0 w-56 h-72 rounded-2xl overflow-hidden shadow-ocean ring-1 ring-white/20 animate-float [animation-delay:1.5s]">
              <img src={lagoonImg} alt="Laguna delle Mauritius vista dall'alto" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </section>
  );
};

export default Hero;
