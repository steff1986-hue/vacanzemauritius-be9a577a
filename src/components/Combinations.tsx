import { useState } from "react";
import { ArrowRight, Calendar, Users, Sparkles, MapPin, Plane } from "lucide-react";
import safariImg from "@/assets/safari-leopard.jpg";
import walkingImg from "@/assets/walking-safari.jpg";
import gorillaImg from "@/assets/gorilla-rwanda.jpg";
import lagoonImg from "@/assets/mauritius-lagoon.jpg";
import resortImg from "@/assets/mauritius-resort.jpg";

type Combo = {
  id: string;
  country: string;
  flag: string;
  hero: string;
  tagline: string;
  description: string;
  safariValue: string;
  mauritiusValue: string;
  target: string;
  bestPeriod: string;
  expect: string[];
  duration: string;
  accent: "ocean" | "forest" | "warm" | "savanna";
};

const COMBOS: Combo[] = [
  {
    id: "kenya",
    country: "Kenya",
    flag: "🇰🇪",
    hero: safariImg,
    tagline: "Il safari classico, il mare iconico.",
    description:
      "La combinazione più leggibile e immediata: la Grande Migrazione del Masai Mara o gli elefanti dell'Amboseli con vista Kilimanjaro, e poi le lagune turchesi dell'Oceano Indiano.",
    safariValue:
      "Big Five, paesaggi sconfinati e fauna densissima. Il safari kenyota è quello che ti immagini quando pensi all'Africa: leoni nella savana al tramonto, mandrie infinite, baobab.",
    mauritiusValue:
      "Decompressione totale dopo i ritmi del safari. Resort family-friendly o adults-only, lagune calme, snorkeling e un'idea di mare diversa rispetto allo Zanzibar di tutti.",
    target: "Famiglie, coppie al primo safari, viaggiatori che vogliono un'Africa leggibile e potente.",
    bestPeriod: "Luglio – Ottobre (Migrazione) · Gennaio – Marzo (clima secco e mare top a Mauritius)",
    expect: [
      "Game drive nella Masai Mara o Amboseli",
      "Volo interno verso il lodge",
      "Volo Nairobi → Mauritius",
      "5 notti in resort lagunare 5★",
    ],
    duration: "11–13 giorni",
    accent: "savanna",
  },
  {
    id: "tanzania",
    country: "Tanzania",
    flag: "🇹🇿",
    hero: walkingImg,
    tagline: "L'iconico più alto, il mare più esclusivo.",
    description:
      "Il combinato più forte sul mercato italiano. Serengeti, Ngorongoro e Tarangire — o il Sud remoto di Nyerere e Ruaha — chiusi alle Mauritius in resort luxury, alternativa raffinata alla solita Zanzibar.",
    safariValue:
      "Concentrazione di fauna ineguagliabile, scenari da documentario, lodge tribali nel Sud. La Tanzania offre il safari più completo e fotogenico del continente.",
    mauritiusValue:
      "The Residence, Constance, One&Only: il livello mare diventa coerente con un safari premium. Un upgrade naturale rispetto a Zanzibar, con servizio europeo.",
    target: "Honeymoon, anniversari importanti, coppie premium che vogliono il top sia in Africa che al mare.",
    bestPeriod: "Giugno – Ottobre (stagione secca, ideale safari + mare) · Dicembre – Febbraio (alta stagione resort)",
    expect: [
      "Cratere del Ngorongoro all'alba",
      "Mongolfiera sul Serengeti (opzionale)",
      "Volo Kilimanjaro/Dar → Mauritius",
      "5–6 notti luxury sulla costa est",
    ],
    duration: "12–14 giorni",
    accent: "forest",
  },
  {
    id: "zambia",
    country: "Zambia",
    flag: "🇿🇲",
    hero: gorillaImg,
    tagline: "Wilderness tecnica, oceano come ricompensa.",
    description:
      "Per chi conosce già l'Africa e vuole salire di qualità: walking safari nel South Luangwa, canoa sul Lower Zambezi, lodge piccoli e tecnici. Poi mare alle Mauritius come contrappunto morbido.",
    safariValue:
      "Il safari più autentico oggi disponibile: walking guidato dai migliori ranger del continente, fauna fitta, niente folla. Lodge con 6–8 tende, esperienza intima.",
    mauritiusValue:
      "Dopo giorni di ritmi naturali e silenzi veri, l'oceano diventa ricompensa pura. Resort raffinati, spa, ritmi lenti. Il giusto contrasto con l'intensità dello Zambia.",
    target: "Repeaters Africa, viaggiatori sofisticati, coppie esperte che cercano qualità più che quantità.",
    bestPeriod: "Giugno – Ottobre (walking safari al meglio) · evita Novembre – Aprile (stagione piogge)",
    expect: [
      "Walking safari con ranger senior",
      "Canoa al tramonto sullo Zambezi",
      "Volo Lusaka/Mfuwe → Mauritius",
      "5–7 notti in boutique resort",
    ],
    duration: "13–15 giorni",
    accent: "warm",
  },
  {
    id: "uganda",
    country: "Uganda",
    flag: "🇺🇬",
    hero: gorillaImg,
    tagline: "Foreste, primati e Oceano Indiano.",
    description:
      "Un viaggio fuori rotta: trekking con i gorilla di Bwindi, scimpanzé nella Kibale Forest, savana del Queen Elizabeth. Poi Mauritius per metabolizzare un'esperienza che non si dimentica.",
    safariValue:
      "Tre habitat in un solo viaggio: foresta pluviale, savana, laghi craterici. Il trekking con i gorilla è semplicemente una delle esperienze più alte che si possano vivere.",
    mauritiusValue:
      "Dopo giorni intensi tra trekking, altitudine e foreste umide, l'isola è il riposo che ci vuole. Resort confortevoli, snorkeling, sole. Tornare a respirare.",
    target: "Viaggiatori attivi, coppie curiose, repeaters Africa che vogliono uscire dal classico safari.",
    bestPeriod: "Giugno – Settembre · Dicembre – Febbraio (foreste meno piovose, trekking più agevole)",
    expect: [
      "Trekking gorilla a Bwindi (1 permit incluso)",
      "Chimp tracking nella Kibale Forest",
      "Volo Entebbe → Mauritius",
      "5 notti in resort lagunare",
    ],
    duration: "12–14 giorni",
    accent: "ocean",
  },
];

const accentMap = {
  ocean: "from-ocean-deep to-ocean",
  forest: "from-primary to-primary-glow",
  warm: "from-warm-brown to-savanna",
  savanna: "from-savanna to-accent",
} as const;

const Combinations = () => {
  const [active, setActive] = useState(COMBOS[0].id);
  const current = COMBOS.find((c) => c.id === active) ?? COMBOS[0];

  return (
    <section id="combinazioni" className="relative py-24 lg:py-32 bg-muted/40 overflow-hidden">
      <div className="container-narrow">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5">
            <span className="hairline" /> Le combinazioni
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground leading-[1.08] text-balance">
            Quattro Africa, una sola fine:{" "}
            <span className="italic text-accent">l'Oceano Indiano.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Ogni combinazione ha un suo carattere. Scegli il safari che ti somiglia, Mauritius
            sarà sempre il finale giusto.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2 mb-10">
          {COMBOS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border transition-smooth ${
                active === c.id
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-background text-foreground border-border hover:border-accent/60 hover:text-accent"
              }`}
            >
              <span className="text-base">{c.flag}</span>
              {c.country} <span className="opacity-60">+ Mauritius</span>
            </button>
          ))}
        </div>

        {/* Active combination */}
        <article
          key={current.id}
          className="grid lg:grid-cols-12 gap-8 bg-background rounded-3xl overflow-hidden shadow-elevated border border-border/60 animate-fade-in"
        >
          {/* Visual split */}
          <div className="lg:col-span-5 relative grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 min-h-[420px] lg:min-h-[560px]">
            <div className="relative overflow-hidden">
              <img
                src={current.hero}
                alt={`Safari in ${current.country}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${accentMap[current.accent]} opacity-30 mix-blend-multiply`} />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full glass-dark text-white px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                <MapPin size={11} /> {current.country}
              </div>
            </div>
            <div className="relative overflow-hidden">
              <img
                src={current.id === "tanzania" ? resortImg : lagoonImg}
                alt="Mauritius"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-ocean-deep/30 to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full glass-dark text-white px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                <MapPin size={11} /> Mauritius
              </div>
            </div>
            {/* connector */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background border border-border shadow-elevated items-center justify-center">
              <Plane size={18} className="text-accent rotate-45" />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
              {current.flag} {current.country} + Mauritius
            </div>
            <h3 className="font-display text-3xl lg:text-4xl font-medium text-foreground leading-tight">
              {current.tagline}
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">{current.description}</p>

            <div className="mt-7 grid sm:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-muted/60 p-5 border border-border/60">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                  <Sparkles size={12} /> Valore safari
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{current.safariValue}</p>
              </div>
              <div className="rounded-2xl bg-ocean/5 p-5 border border-ocean/20">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ocean-deep mb-2">
                  <Sparkles size={12} /> Valore Mauritius
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{current.mauritiusValue}</p>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                  <Users size={12} /> Target ideale
                </div>
                <p className="text-sm text-foreground leading-snug">{current.target}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                  <Calendar size={12} /> Periodo migliore
                </div>
                <p className="text-sm text-foreground leading-snug">{current.bestPeriod}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Cosa aspettarsi
              </div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {current.expect.map((e, i) => (
                  <li
                    key={e}
                    className="flex items-start gap-2.5 text-sm text-foreground/90"
                  >
                    <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-accent/10 text-accent grid place-items-center text-[10px] font-semibold">
                      {i + 1}
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Durata indicativa{" "}
                <span className="text-foreground font-medium">{current.duration}</span>
              </div>
              <a
                href="#richiesta"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-medium shadow-soft hover:bg-accent/90 transition-smooth"
              >
                Richiedi questa combinazione <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Combinations;
