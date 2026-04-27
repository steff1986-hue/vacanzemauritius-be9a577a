import { useState } from "react";
import { COUNTRIES, MAURITIUS, SafariCountry } from "@/data/countries";
import { Plane, ArrowRight, MapPin, Sparkles } from "lucide-react";

const InteractiveMap = () => {
  const [active, setActive] = useState<SafariCountry>(COUNTRIES[0]);

  return (
    <section id="mappa" className="relative py-24 lg:py-32 bg-gradient-to-b from-muted/40 via-background to-background">
      <div className="container-narrow">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Mappa interattiva
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08] text-balance">
            Da dove parte il tuo safari, dove finisce il tuo viaggio.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Seleziona una nazione e visualizza il collegamento con le Mauritius.
            Ogni paese è un ingresso diverso al continente — ogni finale alle Mauritius è cucito di conseguenza.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* Map */}
          <div className="lg:col-span-3 relative bg-card rounded-2xl p-4 lg:p-6 border border-border shadow-soft overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-celeste/20 via-transparent to-aqua/15 pointer-events-none" />
            <svg
              viewBox="0 0 800 600"
              className="w-full h-auto relative"
              role="img"
              aria-label="Mappa interattiva Africa orientale e Mauritius"
            >
              {/* Ocean background */}
              <defs>
                <linearGradient id="ocean-bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--ocean))" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--beige))" />
                  <stop offset="100%" stopColor="hsl(var(--khaki))" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="land-active" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="800" height="600" fill="url(#ocean-bg)" />

              {/* Africa continent (rough silhouette) */}
              <path
                d="M340,150 C380,130 460,135 510,150 C560,165 590,200 600,250 C610,300 600,360 580,420 C560,480 510,530 450,540 C390,545 340,520 310,470 C290,420 290,360 305,300 C315,240 320,180 340,150 Z"
                fill="url(#land)"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />

              {/* Madagascar */}
              <path
                d="M620,400 C635,395 645,420 642,460 C638,500 625,520 615,510 C608,485 610,440 620,400 Z"
                fill="url(#land)"
                opacity="0.9"
              />

              {/* Country shapes */}
              {COUNTRIES.map((c) => {
                const isActive = c.id === active.id;
                return (
                  <g key={c.id} className="cursor-pointer" onClick={() => setActive(c)}>
                    <path
                      d={c.path}
                      fill={isActive ? "url(#land-active)" : "hsl(var(--primary) / 0.15)"}
                      stroke={isActive ? "hsl(var(--accent))" : "hsl(var(--primary) / 0.4)"}
                      strokeWidth={isActive ? 1.8 : 1}
                      className="transition-all duration-500"
                      filter={isActive ? "url(#glow)" : undefined}
                    />
                  </g>
                );
              })}

              {/* Flight line from active country to Mauritius */}
              <path
                key={active.id}
                d={`M ${active.cx},${active.cy} Q ${(active.cx + MAURITIUS.cx) / 2 + 30},${Math.min(active.cy, MAURITIUS.cy) - 60} ${MAURITIUS.cx},${MAURITIUS.cy}`}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                style={{ strokeDasharray: 1000, animation: "draw-line 1.6s ease-out forwards" }}
              />

              {/* Country dots + labels */}
              {COUNTRIES.map((c) => {
                const isActive = c.id === active.id;
                return (
                  <g
                    key={`pin-${c.id}`}
                    className="cursor-pointer"
                    onClick={() => setActive(c)}
                  >
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r={isActive ? 7 : 5}
                      fill={isActive ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    {isActive && (
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r="14"
                        fill="hsl(var(--accent) / 0.25)"
                        className="animate-pulse-dot"
                      />
                    )}
                    <text
                      x={c.cx + 12}
                      y={c.cy + 4}
                      fontSize="13"
                      fontFamily="Inter, sans-serif"
                      fontWeight={isActive ? 700 : 500}
                      fill="hsl(var(--foreground))"
                    >
                      {c.name}
                    </text>
                  </g>
                );
              })}

              {/* Mauritius marker */}
              <g>
                <circle cx={MAURITIUS.cx} cy={MAURITIUS.cy} r="18" fill="hsl(var(--ocean) / 0.2)" />
                <circle cx={MAURITIUS.cx} cy={MAURITIUS.cy} r="9" fill="hsl(var(--ocean))" stroke="hsl(var(--background))" strokeWidth="2" />
                <text x={MAURITIUS.cx + 16} y={MAURITIUS.cy + 5} fontSize="14" fontWeight="700" fill="hsl(var(--ocean-deep))" fontFamily="Fraunces, serif">
                  Mauritius
                </text>
                <text x={MAURITIUS.cx + 16} y={MAURITIUS.cy + 22} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="Inter, sans-serif" letterSpacing="2">
                  OCEANO INDIANO
                </text>
              </g>

              {/* Plane icon along flight path */}
              <g transform={`translate(${(active.cx + MAURITIUS.cx) / 2}, ${(active.cy + MAURITIUS.cy) / 2 - 30})`}>
                <circle r="14" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="1.5" />
                <g transform="translate(-7,-7) scale(0.6)">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="hsl(var(--accent))" />
                </g>
              </g>
            </svg>

            {/* Country tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                    active.id === c.id
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-foreground hover:bg-secondary"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic panel */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <article
              key={active.id}
              className="bg-card border border-border rounded-2xl p-7 lg:p-8 shadow-elevated animate-fade-in"
            >
              <div className="flex items-center gap-2 text-accent text-xs font-medium uppercase tracking-[0.2em] mb-3">
                <MapPin size={14} />
                Safari di partenza
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-medium text-foreground">
                {active.name}
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{active.intro}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {active.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-4 text-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-accent mb-1 flex items-center gap-1.5">
                    <Sparkles size={12} /> Ideale per
                  </div>
                  <p className="text-foreground/90">{active.idealFor}</p>
                </div>
                <div className="rounded-xl bg-ocean/8 border border-ocean/20 p-4 flex gap-3">
                  <Plane size={18} className="text-ocean shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-ocean-deep font-medium mb-1">
                      Finale alle Mauritius
                    </div>
                    <p className="text-foreground/90">{active.finale}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  3 opzioni di itinerario
                </div>
                <ul className="space-y-3">
                  {active.options.map((o, i) => (
                    <li
                      key={i}
                      className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/60 transition-smooth"
                    >
                      <span className="mt-0.5 w-7 h-7 rounded-full bg-forest text-primary-foreground grid place-items-center text-xs font-medium shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-foreground">{o.title}</span>
                          <span className="text-xs text-accent font-medium">{o.days}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{o.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#richiesta"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
              >
                Costruisci questo viaggio <ArrowRight size={16} />
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
