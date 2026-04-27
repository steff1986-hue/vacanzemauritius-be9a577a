import { useEffect, useMemo, useRef, useState } from "react";
import {
  COUNTRIES,
  MAURITIUS,
  AFRICA_PATH,
  MADAGASCAR_PATH,
  SafariCountry,
} from "@/data/countries";
import { Plane, ArrowRight, MapPin, Sparkles, MousePointerClick } from "lucide-react";

const InteractiveMap = () => {
  const [active, setActive] = useState<SafariCountry>(
    COUNTRIES.find((c) => c.id === "tanzania") ?? COUNTRIES[0],
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);

  // Build a curved flight path from active country → Mauritius
  const flightD = useMemo(() => {
    const mx = (active.cx + MAURITIUS.cx) / 2;
    const my = Math.min(active.cy, MAURITIUS.cy) - 90;
    return `M ${active.cx},${active.cy} Q ${mx},${my} ${MAURITIUS.cx},${MAURITIUS.cy}`;
  }, [active]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [flightD]);

  // Plane position: ~62% along the curve (visually nice apex offset)
  const planePos = useMemo(() => {
    if (!pathRef.current || pathLength === 0)
      return { x: (active.cx + MAURITIUS.cx) / 2, y: (active.cy + MAURITIUS.cy) / 2 - 50, angle: 0 };
    const p = pathRef.current.getPointAtLength(pathLength * 0.62);
    const p2 = pathRef.current.getPointAtLength(Math.min(pathLength, pathLength * 0.62 + 1));
    const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    return { x: p.x, y: p.y, angle };
  }, [pathLength, active]);

  return (
    <section
      id="mappa"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-muted/40 via-background to-background"
    >
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
          <div className="mt-5 inline-flex items-center gap-2 text-sm text-accent font-medium bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
            <MousePointerClick size={15} className="animate-pulse-dot" />
            Clicca una destinazione safari e guarda come si collega alle Mauritius
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* Map */}
          <div className="lg:col-span-3 relative bg-card rounded-2xl p-3 sm:p-5 lg:p-6 border border-border shadow-soft overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-celeste/30 via-background/0 to-aqua/20 pointer-events-none" />

            {/* Selected route badge */}
            <div className="absolute top-4 left-4 z-10 glass px-3 py-1.5 rounded-full border border-border shadow-soft flex items-center gap-2 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-muted-foreground uppercase tracking-[0.18em]">Rotta</span>
              <span className="text-foreground">
                {active.name} <span className="text-accent">→</span> Mauritius
              </span>
            </div>

            <svg
              viewBox="0 0 1000 700"
              className="w-full h-auto relative"
              role="img"
              aria-label="Mappa interattiva Africa orientale, australe e Mauritius nell'Oceano Indiano"
            >
              <defs>
                {/* Ocean — deep gradient with subtle radial light */}
                <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.55" />
                  <stop offset="55%" stopColor="hsl(var(--aqua))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--ocean))" stopOpacity="0.45" />
                </linearGradient>
                <radialGradient id="ocean-light" cx="0.75" cy="0.7" r="0.5">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="hsl(var(--celeste))" stopOpacity="0" />
                </radialGradient>

                {/* Land — africa */}
                <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--beige))" />
                  <stop offset="60%" stopColor="hsl(var(--khaki))" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" stopOpacity="0.55" />
                </linearGradient>

                {/* Country active gradient */}
                <linearGradient id="country-active" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" />
                </linearGradient>

                {/* Country hover */}
                <linearGradient id="country-hover" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.45)" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.25)" />
                </linearGradient>

                <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="land-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="hsl(150 35% 12%)" floodOpacity="0.18" />
                </filter>

                {/* Subtle topographic dot pattern for ocean */}
                <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.7" fill="hsl(var(--ocean) / 0.18)" />
                </pattern>
              </defs>

              {/* Ocean base */}
              <rect width="1000" height="700" fill="url(#ocean)" />
              <rect width="1000" height="700" fill="url(#dots)" />
              <rect width="1000" height="700" fill="url(#ocean-light)" />

              {/* Latitude reference lines (very subtle) */}
              <g stroke="hsl(var(--ocean-deep) / 0.12)" strokeWidth="0.6" strokeDasharray="2 5">
                <line x1="0" y1="170" x2="1000" y2="170" />
                <line x1="0" y1="305" x2="1000" y2="305" /> {/* Equator */}
                <line x1="0" y1="440" x2="1000" y2="440" />
                <line x1="0" y1="575" x2="1000" y2="575" />
              </g>
              <text x="14" y="302" fontSize="9" fill="hsl(var(--ocean-deep) / 0.45)" fontFamily="Inter, sans-serif" letterSpacing="3">
                EQUATORE
              </text>

              {/* Africa continent */}
              <g filter="url(#land-shadow)">
                <path
                  d={AFRICA_PATH}
                  fill="url(#land)"
                  stroke="hsl(var(--warm-brown) / 0.4)"
                  strokeWidth="1.2"
                />
              </g>

              {/* Madagascar */}
              <g filter="url(#land-shadow)">
                <path
                  d={MADAGASCAR_PATH}
                  fill="url(#land)"
                  stroke="hsl(var(--warm-brown) / 0.4)"
                  strokeWidth="1"
                  opacity="0.92"
                />
                <text
                  x="660"
                  y="500"
                  fontSize="10"
                  fontWeight="500"
                  fill="hsl(var(--warm-brown))"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="2"
                  opacity="0.75"
                >
                  MADAGASCAR
                </text>
              </g>

              {/* Country shapes (interactive) */}
              {COUNTRIES.map((c) => {
                const isActive = c.id === active.id;
                const isHover = hovered === c.id;
                const fill = isActive
                  ? "url(#country-active)"
                  : isHover
                  ? "url(#country-hover)"
                  : "hsl(var(--primary) / 0.12)";
                return (
                  <g
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => setActive(c)}
                    onMouseEnter={() => setHovered(c.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <path
                      d={c.path}
                      fill={fill}
                      stroke={isActive ? "hsl(var(--accent))" : "hsl(var(--primary) / 0.55)"}
                      strokeWidth={isActive ? 2 : 1.2}
                      filter={isActive ? "url(#soft-glow)" : undefined}
                      style={{ transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)" }}
                    />
                  </g>
                );
              })}

              {/* Flight path */}
              <path
                ref={pathRef}
                key={`flight-${active.id}`}
                d={flightD}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="2.2"
                strokeDasharray="7 7"
                strokeLinecap="round"
                style={{
                  strokeDasharray: pathLength || 1000,
                  strokeDashoffset: pathLength || 1000,
                  animation: "draw-line 1.6s cubic-bezier(0.22,1,0.36,1) forwards",
                }}
              />

              {/* Country pins + labels */}
              {COUNTRIES.map((c) => {
                const isActive = c.id === active.id;
                const isHover = hovered === c.id;
                return (
                  <g
                    key={`pin-${c.id}`}
                    className="cursor-pointer"
                    onClick={() => setActive(c)}
                    onMouseEnter={() => setHovered(c.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {(isActive || isHover) && (
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r="16"
                        fill={isActive ? "hsl(var(--accent) / 0.25)" : "hsl(var(--primary) / 0.2)"}
                        className={isActive ? "animate-pulse-dot" : ""}
                      />
                    )}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r={isActive ? 7 : isHover ? 6 : 4.5}
                      fill={isActive ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      style={{ transition: "all 0.3s ease" }}
                    />
                    {/* Label with subtle backdrop */}
                    <g style={{ transition: "all 0.3s ease" }}>
                      <rect
                        x={c.cx + 10}
                        y={c.cy - 9}
                        width={c.name.length * 6.5 + 12}
                        height="18"
                        rx="9"
                        fill="hsl(var(--background) / 0.85)"
                        stroke={isActive ? "hsl(var(--accent) / 0.5)" : "hsl(var(--border))"}
                        strokeWidth="0.8"
                      />
                      <text
                        x={c.cx + 16}
                        y={c.cy + 4}
                        fontSize="11"
                        fontFamily="Inter, sans-serif"
                        fontWeight={isActive ? 700 : 500}
                        fill="hsl(var(--foreground))"
                      >
                        {c.name}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Mauritius — destination, not selectable */}
              <g>
                <circle
                  cx={MAURITIUS.cx}
                  cy={MAURITIUS.cy}
                  r="26"
                  fill="hsl(var(--ocean) / 0.18)"
                  className="animate-pulse-dot"
                />
                <circle
                  cx={MAURITIUS.cx}
                  cy={MAURITIUS.cy}
                  r="14"
                  fill="hsl(var(--ocean) / 0.3)"
                />
                <circle
                  cx={MAURITIUS.cx}
                  cy={MAURITIUS.cy}
                  r="7"
                  fill="hsl(var(--ocean))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2.2"
                />
                <g transform={`translate(${MAURITIUS.cx + 14}, ${MAURITIUS.cy - 10})`}>
                  <rect
                    x="0"
                    y="0"
                    width="108"
                    height="38"
                    rx="6"
                    fill="hsl(var(--background) / 0.92)"
                    stroke="hsl(var(--ocean) / 0.4)"
                    strokeWidth="0.8"
                  />
                  <text x="10" y="16" fontSize="14" fontWeight="700" fill="hsl(var(--ocean-deep))" fontFamily="Fraunces, serif">
                    Mauritius
                  </text>
                  <text x="10" y="30" fontSize="8.5" fill="hsl(var(--muted-foreground))" fontFamily="Inter, sans-serif" letterSpacing="2.5">
                    OCEANO INDIANO
                  </text>
                </g>
              </g>

              {/* Plane on path */}
              <g
                transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.angle})`}
                style={{ transition: "transform 0.5s ease" }}
              >
                <circle r="13" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="1.5" />
                <g transform="rotate(-45) translate(-6,-6) scale(0.55)">
                  <path
                    d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                    fill="hsl(var(--accent))"
                  />
                </g>
              </g>

              {/* Compass */}
              <g transform="translate(940, 80)">
                <circle r="22" fill="hsl(var(--background) / 0.85)" stroke="hsl(var(--border))" strokeWidth="0.8" />
                <path d="M0,-14 L4,0 L0,14 L-4,0 Z" fill="hsl(var(--accent))" />
                <text x="0" y="-26" textAnchor="middle" fontSize="9" fontWeight="700" fill="hsl(var(--foreground))" fontFamily="Inter, sans-serif">
                  N
                </text>
              </g>
            </svg>

            {/* Country tabs (desktop + mobile) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c)}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
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
                Rotta selezionata: {active.name} → Mauritius
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
                <div className="rounded-xl bg-ocean/[0.08] border border-ocean/20 p-4 flex gap-3">
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
