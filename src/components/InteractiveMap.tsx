import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath, geoCentroid, geoBounds } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { COUNTRIES, MAURITIUS_COORDS, SafariCountry } from "@/data/countries";
import africaGeoRaw from "@/data/africa.geo.json";
import {
  Plane,
  ArrowRight,
  MapPin,
  Sparkles,
  X,
  Calendar,
  Languages,
  Coins,
  Clock,
  Trees,
  Binoculars,
  Heart,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const africaGeo = africaGeoRaw as unknown as FeatureCollection<Geometry, { name: string }>;

const SAFARI_NAMES = new Set(COUNTRIES.map((c) => c.geoName));
const COUNTRY_BY_GEONAME = new Map(COUNTRIES.map((c) => [c.geoName, c]));

const VIEW_W = 1000;
const VIEW_H = 720;

const InteractiveMap = () => {
  const reduced = useReducedMotion();

  const [active, setActive] = useState<SafariCountry>(
    () => COUNTRIES.find((c) => c.id === "tanzania") ?? COUNTRIES[0],
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);

  // ---------- Projection: zoom on East Africa + Indian Ocean ----------
  const projection = useMemo(() => {
    // Frame: roughly from DR Congo west edge to Mauritius east, Ethiopia north to South Africa edge south
    const frame: Feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [12, 14],
            [62, 14],
            [62, -28],
            [12, -28],
            [12, 14],
          ],
        ],
      },
    };
    return geoMercator().fitExtent(
      [
        [30, 30],
        [VIEW_W - 30, VIEW_H - 30],
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

  // ---------- Country labels (centroids) ----------
  const labels = useMemo(() => {
    return africaGeo.features
      .map((f) => {
        const isSafari = SAFARI_NAMES.has(f.properties.name);
        const c = projection(geoCentroid(f));
        if (!c) return null;
        return { name: f.properties.name, x: c[0], y: c[1], isSafari };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [projection]);

  // ---------- Safari pins ----------
  const safariPins = useMemo(() => {
    return COUNTRIES.map((c) => {
      const feat = africaGeo.features.find((f) => f.properties.name === c.geoName);
      const center = feat ? projection(geoCentroid(feat)) : projection(c.coords);
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
    const my = Math.min(sy, ey) - 90;
    return `M ${sx},${sy} Q ${mx},${my} ${ex},${ey}`;
  }, [activePin, mauritiusXY]);

  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [flightD]);

  const planePos = useMemo(() => {
    if (!pathRef.current || pathLength === 0)
      return {
        x: (activePin.x + mauritiusXY.x) / 2,
        y: Math.min(activePin.y, mauritiusXY.y) - 60,
        angle: 0,
      };
    const p = pathRef.current.getPointAtLength(pathLength * 0.6);
    const p2 = pathRef.current.getPointAtLength(Math.min(pathLength, pathLength * 0.6 + 1));
    const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    return { x: p.x, y: p.y, angle };
  }, [pathLength, activePin, mauritiusXY]);

  // ---------- Handlers ----------
  const handleSelect = useCallback((c: SafariCountry) => {
    setActive(c);
  }, []);
  const handleOpenBriefing = useCallback((c: SafariCountry) => {
    setActive(c);
    setBriefingOpen(true);
  }, []);
  const handleEnter = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  // Close on Escape
  useEffect(() => {
    if (!briefingOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBriefingOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [briefingOpen]);

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
            Africa Orientale & Oceano Indiano. Clicca una nazione.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Cinque ingressi al continente, una sola destinazione finale: Mauritius. Tocca un paese
            safari per aprire la <strong className="text-foreground">scheda tecnica</strong>: parchi,
            stagioni, fauna e perché si combina alle Mauritius.
          </p>
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

            {/* Hint */}
            <div className="absolute top-4 right-4 z-10 hidden sm:flex glass px-3 py-1.5 rounded-full border border-border shadow-soft items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles size={12} className="text-accent" />
              Clicca un paese safari
            </div>

            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="w-full h-auto relative"
              role="img"
              aria-label="Mappa interattiva di Africa Orientale e Oceano Indiano: Tanzania, Kenya, Uganda, Ruanda, Zambia e Mauritius"
              style={{ contain: "layout paint" }}
            >
              <defs>
                <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.55" />
                  <stop offset="55%" stopColor="hsl(var(--aqua))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--ocean))" stopOpacity="0.45" />
                </linearGradient>
                <radialGradient id="ocean-glow" cx="0.82" cy="0.7" r="0.5">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="hsl(var(--celeste))" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--beige))" />
                  <stop offset="60%" stopColor="hsl(var(--khaki))" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="safari-idle" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.28)" />
                  <stop offset="100%" stopColor="hsl(var(--accent) / 0.18)" />
                </linearGradient>
                <linearGradient id="safari-hover" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.55)" />
                  <stop offset="100%" stopColor="hsl(var(--accent) / 0.4)" />
                </linearGradient>
                <linearGradient id="safari-active" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" />
                </linearGradient>
                <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                  <feOffset dx="0" dy="2" result="off" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Ocean base */}
              <g shapeRendering="optimizeSpeed">
                <rect width={VIEW_W} height={VIEW_H} fill="url(#ocean)" />
                <rect width={VIEW_W} height={VIEW_H} fill="url(#ocean-glow)" />
              </g>

              {/* Subtle ocean lines (parallels) */}
              {!reduced && (
                <g stroke="hsl(var(--ocean) / 0.12)" strokeWidth="0.5" fill="none">
                  {[0, -10, -20].map((lat) => {
                    const a = projection([0, lat]);
                    if (!a) return null;
                    return <line key={lat} x1={0} x2={VIEW_W} y1={a[1]} y2={a[1]} strokeDasharray="2 6" />;
                  })}
                </g>
              )}

              {/* Countries */}
              <g shapeRendering="geometricPrecision">
                {features.map((f) => {
                  const country = f.country;
                  const isSafari = f.isSafari;
                  const isActive = country?.id === active.id;
                  const isHover = country && hovered === country.id;
                  const fill = isActive
                    ? "url(#safari-active)"
                    : isHover
                    ? "url(#safari-hover)"
                    : isSafari
                    ? "url(#safari-idle)"
                    : "url(#land)";
                  const stroke = isActive
                    ? "hsl(var(--accent))"
                    : isSafari
                    ? "hsl(var(--primary) / 0.7)"
                    : "hsl(var(--warm-brown) / 0.4)";
                  const strokeWidth = isActive ? 2 : isSafari ? 1.2 : 0.6;
                  return (
                    <path
                      key={f.name}
                      d={f.d}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      filter={isActive ? "url(#soft-shadow)" : undefined}
                      className={isSafari ? "cursor-pointer" : undefined}
                      onClick={country ? () => handleOpenBriefing(country) : undefined}
                      onMouseEnter={country ? () => handleEnter(country.id) : undefined}
                      onMouseLeave={country ? handleLeave : undefined}
                      style={{
                        transition: reduced ? "none" : "fill 0.4s ease, stroke 0.4s ease",
                      }}
                    >
                      {country && <title>{country.name} — clicca per scheda tecnica</title>}
                    </path>
                  );
                })}
              </g>

              {/* Country name labels (subtle for non-safari) */}
              {labels.map((l) => {
                if (l.isSafari) return null;
                if (["Comoros", "Seychelles", "Burundi"].includes(l.name)) return null;
                return (
                  <text
                    key={`label-${l.name}`}
                    x={l.x}
                    y={l.y}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="Inter, sans-serif"
                    fill="hsl(var(--warm-brown) / 0.7)"
                    letterSpacing="1.5"
                    pointerEvents="none"
                    style={{ textTransform: "uppercase", fontWeight: 500 }}
                  >
                    {l.name === "DR Congo" ? "R.D. CONGO" : l.name.toUpperCase()}
                  </text>
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
                    onClick={() => handleOpenBriefing(c)}
                    onMouseEnter={() => handleEnter(c.id)}
                    onMouseLeave={handleLeave}
                  >
                    {(isActive || isHover) && (
                      <circle
                        cx={x}
                        cy={y}
                        r="16"
                        fill={isActive ? "hsl(var(--accent) / 0.3)" : "hsl(var(--primary) / 0.22)"}
                        className={isActive && !reduced ? "animate-pulse-dot" : ""}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 7 : isHover ? 6 : 4.5}
                      fill={isActive ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      style={{ transition: reduced ? "none" : "r 0.25s ease" }}
                    />
                    {/* Label badge */}
                    <g filter={isActive ? "url(#soft-shadow)" : undefined}>
                      <rect
                        x={x + 10}
                        y={y - 11}
                        width={c.name.length * 7.2 + 16}
                        height="22"
                        rx="11"
                        fill="hsl(var(--background) / 0.95)"
                        stroke={isActive ? "hsl(var(--accent))" : "hsl(var(--border))"}
                        strokeWidth={isActive ? 1.2 : 0.8}
                      />
                      <text
                        x={x + 18}
                        y={y + 4}
                        fontSize="12"
                        fontFamily="Inter, sans-serif"
                        fontWeight={isActive ? 700 : 600}
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
                  r="26"
                  fill="hsl(var(--ocean) / 0.18)"
                  className={reduced ? "" : "animate-pulse-dot"}
                />
                <circle cx={mauritiusXY.x} cy={mauritiusXY.y} r="13" fill="hsl(var(--ocean) / 0.32)" />
                <circle
                  cx={mauritiusXY.x}
                  cy={mauritiusXY.y}
                  r="6.5"
                  fill="hsl(var(--ocean))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                />
                <g
                  transform={`translate(${mauritiusXY.x + 14}, ${mauritiusXY.y - 12})`}
                  filter="url(#soft-shadow)"
                >
                  <rect
                    x="0"
                    y="0"
                    width="118"
                    height="42"
                    rx="8"
                    fill="hsl(var(--background) / 0.95)"
                    stroke="hsl(var(--ocean) / 0.45)"
                    strokeWidth="1"
                  />
                  <text
                    x="11"
                    y="18"
                    fontSize="15"
                    fontWeight="700"
                    fill="hsl(var(--ocean-deep))"
                    fontFamily="Fraunces, serif"
                  >
                    Mauritius
                  </text>
                  <text
                    x="11"
                    y="33"
                    fontSize="9"
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
                  style={{ transition: "transform 0.6s ease" }}
                  pointerEvents="none"
                  filter="url(#soft-shadow)"
                >
                  <circle r="13" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="1.6" />
                  <g transform="rotate(-45) translate(-7,-7) scale(0.58)">
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                      fill="hsl(var(--accent))"
                    />
                  </g>
                </g>
              )}

              {/* Compass */}
              <g transform={`translate(${VIEW_W - 50}, 50)`} pointerEvents="none">
                <circle r="22" fill="hsl(var(--background) / 0.9)" stroke="hsl(var(--border))" strokeWidth="0.8" />
                <path d="M0,-14 L4.5,0 L0,14 L-4.5,0 Z" fill="hsl(var(--accent))" />
                <text
                  x="0"
                  y="-26"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="hsl(var(--foreground))"
                  fontFamily="Inter, sans-serif"
                >
                  N
                </text>
              </g>

              {/* Scale legend */}
              <g transform={`translate(30, ${VIEW_H - 36})`} pointerEvents="none">
                <rect x="0" y="0" width="160" height="22" rx="4" fill="hsl(var(--background) / 0.85)" stroke="hsl(var(--border))" strokeWidth="0.6" />
                <line x1="10" x2="60" y1="11" y2="11" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <text x="68" y="15" fontSize="9.5" fill="hsl(var(--muted-foreground))" fontFamily="Inter, sans-serif">~1000 km</text>
              </g>
            </svg>

            {/* Country quick tabs */}
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
              <button
                onClick={() => setBriefingOpen(true)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-accent text-accent-foreground hover:opacity-90 transition-smooth shadow-soft"
              >
                Apri scheda tecnica →
              </button>
            </div>
          </div>

          {/* Side summary */}
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

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <InfoChip icon={<Calendar size={14} />} label="Stagione" value={active.briefing.bestSeason} />
                <InfoChip icon={<Clock size={14} />} label="Volo" value={active.briefing.flightTime} />
                <InfoChip icon={<Trees size={14} />} label="Parchi" value={`${active.briefing.parks.length} principali`} />
                <InfoChip icon={<Heart size={14} />} label="Mood" value={active.idealFor.split(",")[0]} />
              </div>

              <button
                onClick={() => setBriefingOpen(true)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-foreground text-background font-medium text-sm hover:opacity-90 transition-smooth"
              >
                Scheda tecnica completa <ArrowRight size={16} />
              </button>

              <a
                href="#richiesta"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
              >
                Costruisci questo viaggio <ArrowRight size={16} />
              </a>
            </article>
          </div>
        </div>
      </div>

      {/* Briefing Modal */}
      {briefingOpen && (
        <BriefingModal country={active} onClose={() => setBriefingOpen(false)} reduced={reduced} />
      )}
    </section>
  );
};

const InfoChip = memo(
  ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="rounded-xl bg-muted/60 border border-border px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
        <span className="text-accent">{icon}</span>
        {label}
      </div>
      <div className="text-foreground text-[13px] font-medium leading-tight">{value}</div>
    </div>
  ),
);
InfoChip.displayName = "InfoChip";

const BriefingModal = ({
  country,
  onClose,
  reduced,
}: {
  country: SafariCountry;
  onClose: () => void;
  reduced: boolean;
}) => {
  const b = country.briefing;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 ${
        reduced ? "" : "animate-fade-in"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
    >
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-elevated max-w-3xl w-full max-h-[92vh] overflow-y-auto ${
          reduced ? "" : "animate-scale-in"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-6 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-0.5">
              Scheda tecnica · Briefing paese
            </div>
            <h3 id="briefing-title" className="font-display text-2xl sm:text-3xl font-medium text-foreground">
              {country.name} <span className="text-accent">→</span> Mauritius
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-10 h-10 rounded-full bg-muted hover:bg-secondary grid place-items-center transition-smooth"
            aria-label="Chiudi scheda"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-7">
          {/* Quick facts grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Fact icon={<MapPin size={14} />} label="Capitale" value={b.capital} />
            <Fact icon={<Languages size={14} />} label="Lingue" value={b.language} />
            <Fact icon={<Coins size={14} />} label="Valuta" value={b.currency} />
            <Fact icon={<Calendar size={14} />} label="Stagione" value={b.bestSeason} />
          </div>

          {/* Intro */}
          <div>
            <SectionTitle>Introduzione</SectionTitle>
            <p className="text-foreground/85 leading-relaxed">{country.intro}</p>
          </div>

          {/* Signature experience */}
          <div className="rounded-2xl bg-accent/8 border border-accent/25 p-5 flex gap-4">
            <Sparkles size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-accent font-medium mb-1">
                Esperienza signature
              </div>
              <p className="text-foreground font-medium">{b.signature}</p>
            </div>
          </div>

          {/* Parks & wildlife */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <SectionTitle>
                <Trees size={14} className="inline -mt-0.5 mr-1.5 text-accent" />
                Parchi principali
              </SectionTitle>
              <ul className="space-y-1.5">
                {b.parks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <span className="mt-2 w-1 h-1 rounded-full bg-accent shrink-0" />
                    <span className="text-foreground/85">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionTitle>
                <Binoculars size={14} className="inline -mt-0.5 mr-1.5 text-accent" />
                Fauna iconica
              </SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {b.wildlife.map((w) => (
                  <span
                    key={w}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border text-foreground/85"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Itineraries */}
          <div>
            <SectionTitle>3 itinerari su misura</SectionTitle>
            <ul className="space-y-2.5">
              {country.options.map((o, i) => (
                <li
                  key={i}
                  className="group flex items-start gap-3 p-3 rounded-xl border border-border hover:border-accent/40 hover:bg-muted/40 transition-smooth"
                >
                  <span className="mt-0.5 w-7 h-7 rounded-full bg-foreground text-background grid place-items-center text-xs font-medium shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{o.title}</span>
                      <span className="text-xs text-accent font-medium">{o.days}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{o.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Why combine with Mauritius */}
          <div className="rounded-2xl bg-ocean/[0.08] border border-ocean/25 p-5 flex gap-4">
            <Plane size={20} className="text-ocean shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-ocean-deep font-medium mb-1">
                Perché combinarla con Mauritius
              </div>
              <p className="text-foreground/90 leading-relaxed mb-2">{b.whyCombine}</p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Finale:</strong> {country.finale}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="#richiesta"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-medium hover:opacity-90 transition-smooth shadow-soft"
            >
              Costruisci {country.name} + Mauritius <ArrowRight size={16} />
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-full border border-border text-foreground hover:bg-muted transition-smooth font-medium"
            >
              Esplora altri paesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2.5">
    {children}
  </div>
);

const Fact = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-xl bg-muted/50 border border-border px-3 py-3">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
      <span className="text-accent">{icon}</span>
      {label}
    </div>
    <div className="text-foreground text-[13px] font-medium leading-tight">{value}</div>
  </div>
);

export default InteractiveMap;
