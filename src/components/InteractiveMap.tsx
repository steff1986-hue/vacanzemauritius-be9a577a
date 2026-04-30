import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
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
  Navigation,
  Waves,
  Info,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const africaGeo = africaGeoRaw as unknown as FeatureCollection<Geometry, { name: string }>;

const SAFARI_NAMES = new Set(COUNTRIES.map((c) => c.geoName));
const COUNTRY_BY_GEONAME = new Map(COUNTRIES.map((c) => [c.geoName, c]));

const VIEW_W = 1000;
const VIEW_H = 720;

const formatGeoLabel = (name: string) => {
  if (name === "DR Congo") return "R.D. CONGO";
  return name.toUpperCase();
};

const InteractiveMap = () => {
  const reduced = useReducedMotion();

  const [active, setActive] = useState<SafariCountry>(
    () => COUNTRIES.find((c) => c.id === "tanzania") ?? COUNTRIES[0],
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);

  // Projection zoomed on East/Southern Africa + Indian Ocean, with Mauritius kept in frame.
  const projection = useMemo(() => {
    return geoMercator()
      .center([36.8, -8.5])
      .scale(760)
      .translate([VIEW_W * 0.42, VIEW_H * 0.5]);
  }, []);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  const features = useMemo(() => {
    return africaGeo.features
      .map((f) => {
        const d = pathGen(f);
        if (!d) return null;
        const country = COUNTRY_BY_GEONAME.get(f.properties.name) ?? null;
        return {
          name: f.properties.name,
          d,
          isSafari: SAFARI_NAMES.has(f.properties.name),
          country,
          centroid: projection(geoCentroid(f)),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [pathGen, projection]);

  const contextFeatures = useMemo(() => features.filter((f) => !f.isSafari && f.name !== "Mauritius"), [features]);
  const safariFeatures = useMemo(() => features.filter((f) => f.isSafari), [features]);

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
    return { x: p?.[0] ?? VIEW_W - 140, y: p?.[1] ?? VIEW_H - 150 };
  }, [projection]);

  const activePin = safariPins.find((p) => p.country.id === active.id) ?? safariPins[0];

  const buildArc = useCallback((sx: number, sy: number, ex: number, ey: number) => {
    const dx = ex - sx;
    const mx = sx + dx * 0.54;
    const my = Math.min(sy, ey) - Math.max(74, Math.abs(dx) * 0.11);
    return `M ${sx},${sy} Q ${mx},${my} ${ex},${ey}`;
  }, []);

  const ghostRoutes = useMemo(
    () =>
      safariPins.map(({ country: c, x, y }) => ({
        id: c.id,
        d: buildArc(x, y, mauritiusXY.x, mauritiusXY.y),
      })),
    [safariPins, mauritiusXY, buildArc],
  );

  const flightD = useMemo(
    () => buildArc(activePin.x, activePin.y, mauritiusXY.x, mauritiusXY.y),
    [activePin, mauritiusXY, buildArc],
  );

  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [flightD]);

  const planePos = useMemo(() => {
    if (!pathRef.current || pathLength === 0) {
      return {
        x: (activePin.x + mauritiusXY.x) / 2,
        y: Math.min(activePin.y, mauritiusXY.y) - 60,
        angle: 0,
      };
    }
    const p = pathRef.current.getPointAtLength(pathLength * 0.58);
    const p2 = pathRef.current.getPointAtLength(Math.min(pathLength, pathLength * 0.58 + 1));
    const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    return { x: p.x, y: p.y, angle };
  }, [pathLength, activePin, mauritiusXY]);

  const handleSelect = useCallback((c: SafariCountry) => {
    setActive(c);
  }, []);
  const handleOpenBriefing = useCallback((c: SafariCountry) => {
    setActive(c);
    setBriefingOpen(true);
  }, []);
  const handleEnter = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  useEffect(() => {
    if (!briefingOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBriefingOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [briefingOpen]);

  return (
    <section
      id="mappa"
      className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-muted/40 via-background to-muted/30"
    >
      <div className="container-narrow">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Mappa interattiva
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08] text-balance">
            Le cinque rotte safari che finiscono nell'Oceano Indiano.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Una carta regionale focalizzata sulle destinazioni reali: Kenya, Tanzania, Zambia,
            Uganda, Ruanda e Mauritius. Tocca una nazione per aprire il briefing tecnico.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-elevated">
            <div className="absolute inset-x-0 top-0 z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="glass px-3 py-2 rounded-full border border-border shadow-soft flex items-center gap-2 text-xs font-medium">
                <span className={`w-1.5 h-1.5 rounded-full bg-accent ${reduced ? "" : "animate-pulse-dot"}`} />
                <span className="text-muted-foreground uppercase tracking-[0.18em]">Rotta</span>
                <span className="text-foreground">
                  {active.name} <span className="text-accent">→</span> Mauritius
                </span>
              </div>
              <div className="hidden sm:flex glass px-3 py-2 rounded-full border border-border shadow-soft items-center gap-1.5 text-[11px] text-muted-foreground">
                <Navigation size={12} className="text-accent" />
                Click sulla nazione
              </div>
            </div>

            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="block w-full h-auto min-h-[510px] sm:min-h-0"
              role="img"
              aria-label="Mappa interattiva con Kenya, Tanzania, Zambia, Uganda, Ruanda e Mauritius"
              style={{ contain: "layout paint" }}
            >
              <defs>
                <linearGradient id="map-ocean" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.9" />
                  <stop offset="46%" stopColor="hsl(var(--aqua))" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="hsl(var(--ocean-deep))" stopOpacity="0.7" />
                </linearGradient>
                <radialGradient id="map-ocean-light" cx="0.76" cy="0.74" r="0.38">
                  <stop offset="0%" stopColor="hsl(var(--celeste))" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="hsl(var(--celeste))" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="map-land" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--beige))" stopOpacity="0.98" />
                  <stop offset="58%" stopColor="hsl(var(--khaki))" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" stopOpacity="0.74" />
                </linearGradient>
                <linearGradient id="map-target" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
                <linearGradient id="map-target-active" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--savanna))" />
                </linearGradient>
                <pattern id="atlas-grain" width="18" height="18" patternUnits="userSpaceOnUse">
                  <path d="M0 18L18 0M-4 5L5-4M13 22L22 13" stroke="hsl(var(--background) / 0.18)" strokeWidth="0.8" />
                </pattern>
                <pattern id="water-lines" width="52" height="18" patternUnits="userSpaceOnUse">
                  <path d="M0 9C8 2 16 16 26 9S44 2 52 9" fill="none" stroke="hsl(var(--ocean-deep) / 0.14)" strokeWidth="1" />
                </pattern>
                <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="5" result="off" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.28" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="country-lift" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="hsl(var(--foreground))" floodOpacity="0.18" />
                </filter>
                <linearGradient id="route-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="55%" stopColor="hsl(var(--savanna))" />
                  <stop offset="100%" stopColor="hsl(var(--ocean))" />
                </linearGradient>
                <filter id="route-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.2" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <rect width={VIEW_W} height={VIEW_H} fill="url(#map-ocean)" />
              <rect width={VIEW_W} height={VIEW_H} fill="url(#map-ocean-light)" />
              <rect width={VIEW_W} height={VIEW_H} fill="url(#water-lines)" opacity="0.55" />

              <g pointerEvents="none" opacity="0.8">
                <ellipse cx="790" cy="566" rx="170" ry="74" fill="none" stroke="hsl(var(--background) / 0.36)" strokeWidth="1" />
                <ellipse cx="790" cy="566" rx="118" ry="50" fill="none" stroke="hsl(var(--background) / 0.42)" strokeWidth="1" />
                <ellipse cx="790" cy="566" rx="74" ry="30" fill="none" stroke="hsl(var(--background) / 0.46)" strokeWidth="1" />
              </g>

              <g shapeRendering="geometricPrecision">
                {contextFeatures.map((f) => (
                  <path
                    key={f.name}
                    d={f.d}
                    fill="url(#map-land)"
                    stroke="hsl(var(--warm-brown) / 0.42)"
                    strokeWidth="0.85"
                    strokeLinejoin="round"
                    opacity="0.74"
                  />
                ))}
              </g>

              <g opacity="0.22" pointerEvents="none">
                {contextFeatures.map((f) => (
                  <path key={`grain-${f.name}`} d={f.d} fill="url(#atlas-grain)" />
                ))}
              </g>

              {!reduced && (
                <g pointerEvents="none" opacity="0.42">
                  {[28, 34, 40, 46, 52, 58].map((lon) => {
                    const top = projection([lon, 12]);
                    const bottom = projection([lon, -27]);
                    if (!top || !bottom) return null;
                    return <line key={`lon-${lon}`} x1={top[0]} y1={top[1]} x2={bottom[0]} y2={bottom[1]} stroke="hsl(var(--background) / 0.42)" strokeDasharray="2 10" />;
                  })}
                  {[5, -5, -15, -25].map((lat) => {
                    const left = projection([22, lat]);
                    const right = projection([60, lat]);
                    if (!left || !right) return null;
                    return <line key={`lat-${lat}`} x1={left[0]} y1={left[1]} x2={right[0]} y2={right[1]} stroke="hsl(var(--background) / 0.42)" strokeDasharray="2 10" />;
                  })}
                </g>
              )}

              <g shapeRendering="geometricPrecision">
                {safariFeatures.map((f) => {
                  const country = f.country;
                  if (!country) return null;
                  const isActive = country.id === active.id;
                  const isHover = hovered === country.id;
                  return (
                    <path
                      key={f.name}
                      d={f.d}
                      fill={isActive ? "url(#map-target-active)" : isHover ? "url(#map-target)" : "hsl(var(--primary) / 0.52)"}
                      stroke={isActive || isHover ? "hsl(var(--background))" : "hsl(var(--primary-glow))"}
                      strokeWidth={isActive ? 3.2 : isHover ? 2.4 : 1.5}
                      strokeLinejoin="round"
                      filter={isActive || isHover ? "url(#country-lift)" : "url(#map-shadow)"}
                      className="cursor-pointer"
                      onClick={() => handleOpenBriefing(country)}
                      onMouseEnter={() => handleEnter(country.id)}
                      onMouseLeave={handleLeave}
                      style={{ transition: reduced ? "none" : "fill 0.35s ease, stroke 0.35s ease, stroke-width 0.35s ease" }}
                    >
                      <title>{country.name} — clicca per scheda tecnica</title>
                    </path>
                  );
                })}
              </g>

              {/* Ghost routes: every country → Mauritius, faintly visible always */}
              <g pointerEvents="none">
                {ghostRoutes.map((r) => {
                  const isActive = r.id === active.id;
                  if (isActive) return null;
                  return (
                    <path
                      key={`ghost-${r.id}`}
                      d={r.d}
                      fill="none"
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.18"
                      strokeWidth="1"
                      strokeDasharray="2 6"
                      strokeLinecap="round"
                      style={{ transition: reduced ? "none" : "stroke-opacity 0.35s ease" }}
                    />
                  );
                })}
              </g>

              {/* Active route: halo + draw-in + flowing dashes */}
              <g pointerEvents="none">
                {!reduced && (
                  <path
                    key={`glow-${active.id}`}
                    d={flightD}
                    fill="none"
                    stroke="url(#route-gradient)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    opacity="0.45"
                    filter="url(#route-glow-filter)"
                    className="animate-route-glow"
                  />
                )}
                <path
                  ref={pathRef}
                  key={`flight-base-${active.id}`}
                  d={flightD}
                  fill="none"
                  stroke="hsl(var(--background))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.78"
                />
                <path
                  key={`flight-draw-${active.id}`}
                  d={flightD}
                  fill="none"
                  stroke="url(#route-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={
                    reduced
                      ? { opacity: 0.95 }
                      : {
                          strokeDasharray: pathLength || 1000,
                          strokeDashoffset: pathLength || 1000,
                          animation: "draw-line 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
                        }
                  }
                />
                {!reduced && (
                  <path
                    key={`flight-flow-${active.id}`}
                    d={flightD}
                    fill="none"
                    stroke="hsl(var(--background))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="2 14"
                    className="animate-flow-dash"
                    style={{ opacity: 0.95, animationDelay: "1s" }}
                  />
                )}
              </g>

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
                    {isHover && !isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r={14}
                        fill="none"
                        stroke="hsl(var(--accent) / 0.55)"
                        strokeWidth="1"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 7.5 : 5.7}
                      fill={isActive ? "hsl(var(--background))" : "hsl(var(--accent))"}
                      stroke={isActive ? "hsl(var(--accent))" : "hsl(var(--background))"}
                      strokeWidth="2.4"
                    />
                    <MapLabel x={x} y={y} country={c} active={isActive} />
                  </g>
                );
              })}

              {contextFeatures.map((f) => {
                if (!f.centroid || ["Comoros", "Seychelles", "Burundi"].includes(f.name)) return null;
                return (
                  <text
                    key={`label-${f.name}`}
                    x={f.centroid[0]}
                    y={f.centroid[1]}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="Inter, sans-serif"
                    fill="hsl(var(--warm-brown) / 0.68)"
                    letterSpacing="1.4"
                    pointerEvents="none"
                    style={{ textTransform: "uppercase", fontWeight: 700 }}
                  >
                    {formatGeoLabel(f.name)}
                  </text>
                );
              })}

              <g pointerEvents="none" filter="url(#map-shadow)">
                <circle cx={mauritiusXY.x} cy={mauritiusXY.y} r="17" fill="hsl(var(--ocean) / 0.34)" />
                <circle
                  cx={mauritiusXY.x}
                  cy={mauritiusXY.y}
                  r="7"
                  fill="hsl(var(--ocean-deep))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2.4"
                />
                <g transform={`translate(${mauritiusXY.x + 18}, ${mauritiusXY.y - 18})`}>
                  <rect
                    x="0"
                    y="0"
                    width="128"
                    height="47"
                    rx="12"
                    fill="hsl(var(--background) / 0.95)"
                    stroke="hsl(var(--ocean) / 0.38)"
                    strokeWidth="1"
                  />
                  <text x="12" y="20" fontSize="16" fontWeight="700" fill="hsl(var(--ocean-deep))" fontFamily="Fraunces, serif">
                    Mauritius
                  </text>
                  <text x="12" y="36" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="Inter, sans-serif" letterSpacing="2.2">
                    FINALE MARE
                  </text>
                </g>
              </g>

              {!reduced && (
                <g
                  transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.angle})`}
                  style={{ transition: "transform 0.55s ease" }}
                  pointerEvents="none"
                  filter="url(#map-shadow)"
                >
                  <circle r="14" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="1.8" />
                  <g transform="rotate(-45) translate(-7,-7) scale(0.58)">
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                      fill="hsl(var(--accent))"
                    />
                  </g>
                </g>
              )}

              <g transform="translate(40 626)" pointerEvents="none">
                <rect x="0" y="0" width="224" height="50" rx="14" fill="hsl(var(--background) / 0.86)" stroke="hsl(var(--border))" />
                <Waves size={16} x={14} y={17} color="hsl(var(--ocean-deep))" />
                <text x="40" y="21" fontSize="10" fontWeight="700" fill="hsl(var(--foreground))" fontFamily="Inter, sans-serif" letterSpacing="1.5">
                  AFRICA ORIENTALE
                </text>
                <text x="40" y="37" fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="Inter, sans-serif">
                  Focus su 5 paesi + Mauritius
                </text>
              </g>
            </svg>

            <div className="p-4 sm:p-5 border-t border-border bg-background/72">
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    onMouseEnter={() => handleEnter(c.id)}
                    onMouseLeave={handleLeave}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                      active.id === c.id
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-card text-foreground border border-border hover:border-accent/60 hover:text-accent"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
                <button
                  onClick={() => setBriefingOpen(true)}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-accent text-accent-foreground hover:opacity-90 transition-smooth shadow-soft"
                >
                  Scheda tecnica →
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <article
              key={active.id}
              className={`relative overflow-hidden bg-card border border-border rounded-[2rem] p-7 lg:p-8 shadow-elevated ${
                reduced ? "" : "animate-fade-in"
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-savanna-ocean" />
              <div className="flex items-center gap-2 text-accent text-xs font-medium uppercase tracking-[0.2em] mb-3">
                <MapPin size={14} />
                Combo selezionata
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-medium text-foreground">
                {active.name} <span className="text-accent">→</span> Mauritius
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
                <InfoChip icon={<Heart size={14} />} label="Target" value={active.idealFor.split(",")[0]} />
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

            <FlightCard country={active} reduced={reduced} />
          </div>
        </div>
      </div>

      {briefingOpen && <BriefingModal country={active} onClose={() => setBriefingOpen(false)} reduced={reduced} />}
    </section>
  );
};

const FlightCard = ({ country, reduced }: { country: SafariCountry; reduced: boolean }) => {
  const b = country.briefing;
  return (
    <aside
      key={`flight-${country.id}`}
      className={`relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft ${
        reduced ? "" : "animate-fade-in"
      }`}
      aria-label="Dettagli volo e scali"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-ocean" />
      <div className="p-6 lg:p-7">
        <div className="flex items-center gap-2 text-ocean-deep text-[11px] font-medium uppercase tracking-[0.2em] mb-4">
          <Plane size={14} />
          Volo & rotta
        </div>

        <div className="relative flex items-center gap-3 mb-5">
          <div className="flex flex-col items-center min-w-0">
            <div className="w-9 h-9 rounded-full bg-foreground text-background grid place-items-center text-[10px] font-bold">
              {country.name.slice(0, 3).toUpperCase()}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5 truncate max-w-[80px]">
              {country.name}
            </div>
          </div>

          <div className="relative flex-1 h-9 flex items-center">
            <svg viewBox="0 0 200 28" className="w-full h-7" preserveAspectRatio="none">
              <path
                d="M 4 22 Q 100 -6 196 22"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="1.6"
                strokeDasharray="3 5"
                strokeLinecap="round"
                style={reduced ? undefined : { animation: "flow-dash 1.6s linear infinite" }}
              />
              <circle cx="4" cy="22" r="2.6" fill="hsl(var(--foreground))" />
              <circle cx="196" cy="22" r="2.6" fill="hsl(var(--ocean-deep))" />
            </svg>
            <div
              className={`absolute left-1/2 -translate-x-1/2 -top-0.5 w-7 h-7 rounded-full bg-background border border-accent grid place-items-center shadow-soft ${
                reduced ? "" : "animate-float"
              }`}
            >
              <Plane size={13} className="text-accent -rotate-12" />
            </div>
          </div>

          <div className="flex flex-col items-center min-w-0">
            <div className="w-9 h-9 rounded-full bg-ocean-deep text-background grid place-items-center text-[10px] font-bold">
              MRU
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
              Mauritius
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-left rounded-xl bg-muted/60 border border-border px-3 py-2.5 hover:border-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-smooth"
                aria-label="Dettaglio composizione durata volo"
              >
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                  <Clock size={12} className="text-accent" /> Durata stimata
                  <Info size={11} className="ml-auto text-muted-foreground/70" />
                </div>
                <div className="text-foreground text-[13px] font-medium leading-tight underline decoration-dotted decoration-accent/50 underline-offset-4">
                  {b.flightTime}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[280px] p-0 bg-card text-foreground border border-border shadow-elevated">
              <div className="p-3.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-accent font-medium mb-2">
                  Come si compone
                </div>
                <ul className="space-y-2 text-[12px] leading-snug">
                  <li className="flex gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">Italia → Africa</div>
                      <div className="text-muted-foreground">{b.flightTime}, volo principale</div>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">Scalo</div>
                      <div className="text-muted-foreground">~1–3h in {b.stops[0]?.split(" (")[0] ?? "hub intercontinentale"}</div>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ocean-deep shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">{country.name.split(" ")[0]} → Mauritius</div>
                      <div className="text-muted-foreground">~5–7h via Nairobi o Johannesburg</div>
                    </div>
                  </li>
                </ul>
                <div className="mt-2.5 pt-2.5 border-t border-border text-[11px] text-muted-foreground">
                  Stima totale porta a porta: variabile in base a scalo e tratta finale.
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
          <div className="rounded-xl bg-muted/60 border border-border px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
              <Navigation size={12} className="text-accent" /> Routing
            </div>
            <div className="text-foreground text-[13px] font-medium leading-tight">
              {b.routing}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2">
            Scali tipici dall'Italia
          </div>
          <ul className="space-y-1.5">
            {b.stops.map((s) => (
              <li key={s} className="flex items-start gap-2 text-[13px]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-foreground/85">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground leading-relaxed">
          + tratta finale <strong className="text-foreground">{country.name.split(" ")[0]} → Mauritius</strong>{" "}
          via Nairobi o Johannesburg, ~5–7h.
        </div>
      </div>
    </aside>
  );
};

const MapLabel = ({
  x,
  y,
  country,
  active,
}: {
  x: number;
  y: number;
  country: SafariCountry;
  active: boolean;
}) => {
  const label = country.name.toUpperCase();
  const width = Math.max(70, label.length * 8.2 + 20);
  const offsetX = country.id === "rwanda" || country.id === "uganda" ? 14 : 16;
  const offsetY = country.id === "rwanda" ? 16 : -14;

  return (
    <g transform={`translate(${x + offsetX} ${y + offsetY})`} pointerEvents="none">
      <rect
        x="0"
        y="0"
        width={width}
        height="25"
        rx="12.5"
        fill={active ? "hsl(var(--foreground) / 0.92)" : "hsl(var(--background) / 0.92)"}
        stroke={active ? "hsl(var(--accent))" : "hsl(var(--border))"}
        strokeWidth="1"
      />
      <text
        x="10"
        y="16.5"
        fontSize="10.5"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        letterSpacing="1.15"
        fill={active ? "hsl(var(--background))" : "hsl(var(--foreground))"}
      >
        {label}
      </text>
    </g>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Fact icon={<MapPin size={14} />} label="Capitale" value={b.capital} />
            <Fact icon={<Languages size={14} />} label="Lingue" value={b.language} />
            <Fact icon={<Coins size={14} />} label="Valuta" value={b.currency} />
            <Fact icon={<Calendar size={14} />} label="Stagione" value={b.bestSeason} />
          </div>

          <div>
            <SectionTitle>Introduzione</SectionTitle>
            <p className="text-foreground/85 leading-relaxed">{country.intro}</p>
          </div>

          <div className="rounded-2xl bg-accent/8 border border-accent/25 p-5 flex gap-4">
            <Sparkles size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-accent font-medium mb-1">
                Esperienza signature
              </div>
              <p className="text-foreground font-medium">{b.signature}</p>
            </div>
          </div>

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

          <div className="rounded-2xl border border-border bg-muted/40 p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-3">
              <Plane size={14} className="text-accent" /> Volo dall'Italia
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Durata: </span>
                <span className="text-foreground font-medium">{b.flightTime}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Routing: </span>
                <span className="text-foreground font-medium">{b.routing}</span>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">Scali tipici</div>
            <div className="flex flex-wrap gap-1.5">
              {b.stops.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-background border border-border text-foreground/85">
                  {s}
                </span>
              ))}
            </div>
          </div>

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
