import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  COUNTRIES,
  MAURITIUS_COORDS,
  SafariCountry,
} from "@/data/countries";
import africaGeoRaw from "@/data/africa.geo.json";
import { Plane, ArrowRight, MapPin, Sparkles, MousePointerClick } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const africaGeo = africaGeoRaw as unknown as FeatureCollection<Geometry, { name: string }>;

const SAFARI_NAMES = new Set(COUNTRIES.map((c) => c.geoName));
const COUNTRY_BY_GEONAME = new Map(COUNTRIES.map((c) => [c.geoName, c]));

const VIEW_W = 1000;
const VIEW_H = 700;

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const lite = isMobile || reduced;

  const [active, setActive] = useState<SafariCountry>(
    () => COUNTRIES.find((c) => c.id === "tanzania") ?? COUNTRIES[0],
  );
  const [hovered, setHovered] = useState<string | null>(null);

  // ---------- Projection ----------
  // Frame on Africa + Indian Ocean (incl. Mauritius, ~57°E).
  // We use a manual fitExtent on a synthetic feature covering [Africa bbox] ∪ Mauritius.
  const projection = useMemo(() => {
    const frame: Feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-20, 38],
            [62, 38],
            [62, -38],
            [-20, -38],
            [-20, 38],
          ],
        ],
      },
    };
    return geoMercator().fitExtent(
      [
        [20, 20],
        [VIEW_W - 20, VIEW_H - 20],
      ],
      frame,
    );
  }, []);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  // ---------- Pre-computed feature paths ----------
  const features = useMemo(() => {
    return africaGeo.features
      .map((f) => {
        const d = pathGen(f);
        if (!d) return null;
        const isSafari = SAFARI_NAMES.has(f.properties.name);
        return {
          name: f.properties.name,
          d,
          isSafari,
          country: COUNTRY_BY_GEONAME.get(f.properties.name) ?? null,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [pathGen]);

  // ---------- Centroids in screen coords ----------
  const safariPins = useMemo(() => {
    return COUNTRIES.map((c) => {
      const feat = africaGeo.features.find((f) => f.properties.name === c.geoName);
      const center = feat
        ? projection(geoCentroid(feat))
        : projection(c.coords);
      return {
        country: c,
        x: center?.[0] ?? 0,
        y: center?.[1] ?? 0,
      };
    });
  }, [projection]);

  const mauritiusXY = useMemo(() => {
    const p = projection(MAURITIUS_COORDS);
    return { x: p?.[0] ?? VIEW_W - 60, y: p?.[1] ?? VIEW_H - 120 };
  }, [projection]);

  const activePin = safariPins.find((p) => p.country.id === active.id)!;

  // ---------- Flight path ----------
  const flightD = useMemo(() => {
    const sx = activePin.x;
    const sy = activePin.y;
    const ex = mauritiusXY.x;
    const ey = mauritiusXY.y;
    const mx = (sx + ex) / 2;
    const my = Math.min(sy, ey) - 80;
    return `M ${sx},${sy} Q ${mx},${my} ${ex},${ey}`;
  }, [activePin, mauritiusXY]);

  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [flightD]);

  const planePos = useMemo(() => {
    if (!pathRef.current || pathLength === 0)
      return { x: (activePin.x + mauritiusXY.x) / 2, y: Math.min(activePin.y, mauritiusXY.y) - 50, angle: 0 };
    const p = pathRef.current.getPointAtLength(pathLength * 0.62);
    const p2 = pathRef.current.getPointAtLength(Math.min(pathLength, pathLength * 0.62 + 1));
    const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    return { x: p.x, y: p.y, angle };
  }, [pathLength, activePin, mauritiusXY]);

  // ---------- Madagascar label position ----------
  const madagascarLabel = useMemo(() => {
    const feat = africaGeo.features.find((f) => f.properties.name === "Madagascar");
    if (!feat) return null;
    const c = projection(geoCentroid(feat));
    return c ? { x: c[0], y: c[1] } : null;
  }, [projection]);

  // ---------- Handlers ----------
  const handleSelect = useCallback((c: SafariCountry) => setActive(c), []);
  const handleEnter = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

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
            <MousePointerClick size={15} className={reduced ? "" : "animate-pulse-dot"} />
            Clicca una destinazione safari e guarda come si collega alle Mauritius
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* Map */}
          <div className="lg:col-span-3 relative bg-card rounded-2xl p-3 sm:p-5 lg:p-6 border border-border shadow-soft overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-celeste/30 via-background/0 to-aqua/20 pointer-events-none" />

            {/* Selected route badge */}
            <div className="absolute top-4 left-4 z-10 glass px-3 py-1.5 rounded-full border border-border shadow-soft flex items-center gap-2 text-xs font-medium">
              <span className={`w-1.5 h-1.5 rounded-full bg-accent ${reduced ? "" : "animate-pulse-dot"}`} />
              <span className="text-muted-foreground uppercase tracking-[0.18em]">Rotta</span>
              <span className="text-foreground">
                {active.name} <span className="text-accent">→</span> Mauritius
              </span>
            </div>

            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="w-full h-auto relative"
              role="img"
              aria-label="Mappa geografica dell'Africa con le destinazioni safari Tanzania, Kenya, Uganda, Ruanda, Zambia e Mauritius nell'Oceano Indiano"
              style={{ contain: "layout paint" }}
            >
              <defs>
                <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.6" />
                  <stop offset="55%" stopColor="hsl(var(--aqua))" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="hsl(var(--ocean))" stopOpacity="0.5" />
                </linearGradient>
                <radialGradient id="ocean-light" cx="0.78" cy="0.7" r="0.55">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--celeste))" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--beige))" />
                  <stop offset="60%" stopColor="hsl(var(--khaki))" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="country-active" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" />
                </linearGradient>
                <linearGradient id="country-hover" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.55)" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
                </linearGradient>
                {!lite && (
                  <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.7" fill="hsl(var(--ocean) / 0.18)" />
                  </pattern>
                )}
              </defs>

              {/* Ocean base */}
              <g shapeRendering="optimizeSpeed">
                <rect width={VIEW_W} height={VIEW_H} fill="url(#ocean)" />
                {!lite && <rect width={VIEW_W} height={VIEW_H} fill="url(#dots)" />}
                <rect width={VIEW_W} height={VIEW_H} fill="url(#ocean-light)" />
              </g>

              {/* Africa — real geometry */}
              <g shapeRendering="geometricPrecision">
                {features.map((f) => {
                  const isSafari = f.isSafari;
                  const country = f.country;
                  const isActive = country?.id === active.id;
                  const isHover = country && hovered === country.id;
                  const fill = isActive
                    ? "url(#country-active)"
                    : isHover
                    ? "url(#country-hover)"
                    : isSafari
                    ? "hsl(var(--primary) / 0.18)"
                    : "url(#land)";
                  const stroke = isActive
                    ? "hsl(var(--accent))"
                    : isSafari
                    ? "hsl(var(--primary) / 0.7)"
                    : "hsl(var(--warm-brown) / 0.45)";
                  const strokeWidth = isActive ? 1.8 : isSafari ? 1.1 : 0.7;
                  return (
                    <path
                      key={f.name}
                      d={f.d}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      className={isSafari ? "cursor-pointer" : undefined}
                      onClick={country ? () => handleSelect(country) : undefined}
                      onMouseEnter={country ? () => handleEnter(country.id) : undefined}
                      onMouseLeave={country ? handleLeave : undefined}
                      style={{
                        transition: reduced ? "none" : "fill 0.35s ease, stroke 0.35s ease",
                      }}
                    />
                  );
                })}
              </g>

              {/* Madagascar label */}
              {madagascarLabel && (
                <text
                  x={madagascarLabel.x}
                  y={madagascarLabel.y}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="500"
                  fill="hsl(var(--warm-brown))"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="2"
                  opacity="0.8"
                  pointerEvents="none"
                >
                  MADAGASCAR
                </text>
              )}

              {/* Flight path */}
              <path
                ref={pathRef}
                key={`flight-${active.id}`}
                d={flightD}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                style={
                  reduced
                    ? { opacity: 0.85 }
                    : {
                        strokeDasharray: pathLength || 1000,
                        strokeDashoffset: pathLength || 1000,
                        animation: "draw-line 1.4s cubic-bezier(0.22,1,0.36,1) forwards",
                      }
                }
              />

              {/* Safari pins */}
              {safariPins.map(({ country: c, x, y }) => {
                const isActive = c.id === active.id;
                const isHover = hovered === c.id;
                return (
                  <g
                    key={`pin-${c.id}`}
                    className="cursor-pointer"
                    onClick={() => handleSelect(c)}
                    onMouseEnter={() => handleEnter(c.id)}
                    onMouseLeave={handleLeave}
                  >
                    {(isActive || isHover) && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill={isActive ? "hsl(var(--accent) / 0.28)" : "hsl(var(--primary) / 0.22)"}
                        className={isActive && !reduced ? "animate-pulse-dot" : ""}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 6.5 : isHover ? 5.5 : 4}
                      fill={isActive ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                      stroke="hsl(var(--background))"
                      strokeWidth="1.8"
                    />
                    <g>
                      <rect
                        x={x + 9}
                        y={y - 9}
                        width={c.name.length * 6.5 + 12}
                        height="18"
                        rx="9"
                        fill="hsl(var(--background) / 0.9)"
                        stroke={isActive ? "hsl(var(--accent) / 0.55)" : "hsl(var(--border))"}
                        strokeWidth="0.8"
                      />
                      <text
                        x={x + 15}
                        y={y + 4}
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

              {/* Mauritius destination marker */}
              <g pointerEvents="none">
                <circle
                  cx={mauritiusXY.x}
                  cy={mauritiusXY.y}
                  r="22"
                  fill="hsl(var(--ocean) / 0.18)"
                  className={reduced ? "" : "animate-pulse-dot"}
                />
                <circle cx={mauritiusXY.x} cy={mauritiusXY.y} r="12" fill="hsl(var(--ocean) / 0.32)" />
                <circle
                  cx={mauritiusXY.x}
                  cy={mauritiusXY.y}
                  r="6"
                  fill="hsl(var(--ocean))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                />
                <g transform={`translate(${mauritiusXY.x + 12}, ${mauritiusXY.y - 10})`}>
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
                  <text
                    x="10"
                    y="16"
                    fontSize="14"
                    fontWeight="700"
                    fill="hsl(var(--ocean-deep))"
                    fontFamily="Fraunces, serif"
                  >
                    Mauritius
                  </text>
                  <text
                    x="10"
                    y="30"
                    fontSize="8.5"
                    fill="hsl(var(--muted-foreground))"
                    fontFamily="Inter, sans-serif"
                    letterSpacing="2.5"
                  >
                    OCEANO INDIANO
                  </text>
                </g>
              </g>

              {/* Plane */}
              {!reduced && (
                <g
                  transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.angle})`}
                  style={{ transition: "transform 0.5s ease" }}
                  pointerEvents="none"
                >
                  <circle r="12" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="1.4" />
                  <g transform="rotate(-45) translate(-6,-6) scale(0.5)">
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                      fill="hsl(var(--accent))"
                    />
                  </g>
                </g>
              )}

              {/* Compass */}
              <g transform={`translate(${VIEW_W - 60}, 60)`} pointerEvents="none">
                <circle r="20" fill="hsl(var(--background) / 0.85)" stroke="hsl(var(--border))" strokeWidth="0.8" />
                <path d="M0,-13 L4,0 L0,13 L-4,0 Z" fill="hsl(var(--accent))" />
                <text
                  x="0"
                  y="-24"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="hsl(var(--foreground))"
                  fontFamily="Inter, sans-serif"
                >
                  N
                </text>
              </g>
            </svg>

            {/* Country tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  onMouseEnter={() => handleEnter(c.id)}
                  onMouseLeave={handleLeave}
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
              className={`bg-card border border-border rounded-2xl p-7 lg:p-8 shadow-elevated ${
                reduced ? "" : "animate-fade-in"
              }`}
            >
              <div className="flex items-center gap-2 text-accent text-xs font-medium uppercase tracking-[0.2em] mb-3">
                <MapPin size={14} />
                Rotta selezionata: {active.name} → Mauritius
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-medium text-foreground">{active.name}</h3>
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
