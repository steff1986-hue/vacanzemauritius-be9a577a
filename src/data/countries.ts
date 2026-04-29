export type Briefing = {
  capital: string;
  language: string;
  currency: string;
  bestSeason: string;
  flightTime: string; // from Italy
  /** Typical airline hubs / stopover airports from Italy */
  stops: string[];
  /** Short note on the routing (e.g. "1 scalo via Doha") */
  routing: string;
  parks: string[];
  signature: string; // signature experience
  wildlife: string[];
  whyCombine: string; // why pair with Mauritius
  accent: string; // hsl tailwind token name (e.g., "accent", "ocean")
};

export type SafariCountry = {
  id: "tanzania" | "kenya" | "uganda" | "rwanda" | "zambia";
  /** Name as used in the GeoJSON (`properties.name`) */
  geoName: string;
  /** Display name (Italian) */
  name: string;
  /** Capital / pin location [lon, lat] */
  coords: [number, number];
  intro: string;
  tags: string[];
  idealFor: string;
  finale: string;
  options: { title: string; days: string; detail: string }[];
  briefing: Briefing;
};

export const COUNTRIES: SafariCountry[] = [
  {
    id: "uganda",
    geoName: "Uganda",
    name: "Uganda",
    coords: [32.29, 1.37],
    intro:
      "Primati, foreste e savana, poi decompressione sull'isola. Un viaggio diverso, intenso, perfetto per chi vuole uscire dalla rotta classica.",
    tags: ["Gorilla", "Chimp trekking", "Foresta", "Safari"],
    idealFor: "Viaggiatori attivi, coppie curiose, repeaters Africa.",
    finale: "4–6 notti alle Mauritius dopo trekking ed escursioni nelle foreste.",
    options: [
      { title: "Triangolo Uganda", days: "7–9 giorni", detail: "Murchison Falls · Queen Elizabeth · Kibale" },
      { title: "Gorilla extension", days: "+3 giorni", detail: "Bwindi Impenetrable Forest" },
      { title: "Uganda completa", days: "10–12 giorni", detail: "Foreste, primati, savana, laghi" },
    ],
    briefing: {
      capital: "Kampala",
      language: "Inglese, Swahili",
      currency: "UGX",
      bestSeason: "Giu–Set · Dic–Feb",
      flightTime: "~10h da Italia (scalo)",
      parks: ["Bwindi Impenetrable", "Queen Elizabeth", "Murchison Falls", "Kibale"],
      signature: "Trekking con i gorilla di montagna a Bwindi",
      wildlife: ["Gorilla", "Scimpanzé", "Leoni sugli alberi", "Ippopotami", "Elefanti"],
      whyCombine: "Esperienza intensa nella foresta, poi totale decompressione in resort sul lagoon mauriziano: il contrasto perfetto tra adrenalina e quiete.",
      accent: "forest",
    },
  },
  {
    id: "rwanda",
    geoName: "Rwanda",
    name: "Ruanda",
    coords: [29.87, -1.94],
    intro:
      "Il trekking con i gorilla è una delle esperienze più alte che si possano vivere in Africa. Ruanda costruisce viaggi brevi ma fortissimi.",
    tags: ["Top experience", "Gorilla trekking", "Luxury"],
    idealFor: "Clienti premium, honeymoon d'autore, viaggi brevi ma di altissimo impatto.",
    finale: "4–5 notti alle Mauritius alto di gamma, post trekking.",
    options: [
      { title: "Kigali + Volcanoes", days: "5–6 giorni", detail: "Trekking gorilla con base premium" },
      { title: "Gorilla luxury", days: "6–7 giorni", detail: "Lodge top di gamma e doppio trekking" },
      { title: "Ruanda + Mauritius", days: "10–12 giorni", detail: "Combinato premium, ritmo selezionato" },
    ],
    briefing: {
      capital: "Kigali",
      language: "Kinyarwanda, Francese, Inglese",
      currency: "RWF",
      bestSeason: "Giu–Set · Dic–Feb",
      flightTime: "~9h da Italia (scalo)",
      parks: ["Volcanoes NP", "Nyungwe Forest", "Akagera"],
      signature: "Permit gorilla a Volcanoes: 1 ora faccia a faccia con un gruppo abituato",
      wildlife: ["Gorilla di montagna", "Scimpanzé", "Colobi dorati", "Big Five (Akagera)"],
      whyCombine: "Viaggio breve ma di altissimo impatto emotivo: poche notti in Africa, finale luxury alle Mauritius. Honeymoon d'autore.",
      accent: "accent",
    },
  },
  {
    id: "kenya",
    geoName: "Kenya",
    name: "Kenya",
    coords: [37.91, 0.18],
    intro:
      "Soluzione classica, leggibile e commerciale. Funziona benissimo per chi cerca un viaggio Africa + mare equilibrato e rapido.",
    tags: ["Masai Mara", "Amboseli", "Tsavo", "Primo safari"],
    idealFor: "Famiglie, coppie, chi affronta il primo safari della vita.",
    finale: "4–5 notti alle Mauritius in resort family o adults only.",
    options: [
      { title: "Sud classico", days: "5–6 giorni", detail: "Nairobi · Amboseli · Tsavo" },
      { title: "Ovest iconico", days: "7–9 giorni", detail: "Naivasha · Nakuru · Masai Mara" },
      { title: "Luxury Kenya", days: "8–10 giorni", detail: "Itinerario alto di gamma con Elewana" },
    ],
    briefing: {
      capital: "Nairobi",
      language: "Swahili, Inglese",
      currency: "KES",
      bestSeason: "Lug–Ott (migrazione) · Gen–Feb",
      flightTime: "~8h diretto da Italia",
      parks: ["Masai Mara", "Amboseli", "Tsavo", "Lake Nakuru", "Samburu"],
      signature: "Grande migrazione degli gnu nel Masai Mara (Lug–Ott)",
      wildlife: ["Big Five", "Gnu", "Zebre", "Fenicotteri rosa", "Elefanti dell'Amboseli"],
      whyCombine: "Il binomio più leggibile: safari iconico + spiagge family/honeymoon alle Mauritius. Voli e logistica fluidi.",
      accent: "savanna",
    },
  },
  {
    id: "tanzania",
    geoName: "Tanzania",
    name: "Tanzania",
    coords: [34.89, -6.37],
    intro:
      "La combinazione più forte per il mercato italiano. Safari iconico o remoto e finale mare più esclusivo della classica estensione Zanzibar.",
    tags: ["Nord", "Sud", "Ovest", "Honeymoon"],
    idealFor: "Primo safari, honeymoon, coppie premium. Equilibrio tra emozione e comfort.",
    finale: "4–6 notti alle Mauritius in resort selezionati: The Residence o equivalenti luxury.",
    options: [
      { title: "Nord classico", days: "5–7 giorni", detail: "Tarangire · Ngorongoro · Serengeti" },
      { title: "Sud remoto", days: "8–10 giorni", detail: "Nyerere · Ruaha, lodge piccoli e tribali" },
      { title: "Ovest esclusivo", days: "10–12 giorni", detail: "Katavi · Mahale, scimpanzé e wilderness pura" },
    ],
    briefing: {
      capital: "Dodoma (capitale) · Dar es Salaam",
      language: "Swahili, Inglese",
      currency: "TZS",
      bestSeason: "Giu–Ott · Gen–Feb",
      flightTime: "~9h da Italia (scalo)",
      parks: ["Serengeti", "Ngorongoro", "Tarangire", "Ruaha", "Nyerere"],
      signature: "Migrazione nel Serengeti e cratere di Ngorongoro nello stesso viaggio",
      wildlife: ["Big Five", "Ghepardi", "Leoni", "Coccodrilli del Mara River", "Branchi enormi di elefanti"],
      whyCombine: "Combo top per il mercato italiano: safari iconico in Tanzania, finale alle Mauritius più esclusivo dell'estensione Zanzibar.",
      accent: "accent",
    },
  },
  {
    id: "zambia",
    geoName: "Zambia",
    name: "Zambia",
    coords: [27.85, -13.13],
    intro:
      "Scelta raffinata per chi conosce già l'Africa o vuole una qualità safari superiore: walking safari, conservation areas, lodge tecnici.",
    tags: ["Walking safari", "Lower Zambezi", "South Luangwa", "Remoto"],
    idealFor: "Repeaters Africa, viaggiatori sofisticati, coppie esperte.",
    finale: "5–6 notti alle Mauritius come contrappunto al safari tecnico e remoto.",
    options: [
      { title: "Western axis", days: "6–8 giorni", detail: "Livingstone · Kafue, paesaggi ampi" },
      { title: "Eastern axis", days: "8–10 giorni", detail: "Lower Zambezi · South Luangwa · private conservancies" },
      { title: "Zambia profondo", days: "10–12 giorni", detail: "Chiawa Safari · Bushcamp Company" },
    ],
    briefing: {
      capital: "Lusaka",
      language: "Inglese, Bemba, Nyanja",
      currency: "ZMW",
      bestSeason: "Mag–Ott (stagione secca)",
      flightTime: "~12h da Italia (scalo)",
      parks: ["South Luangwa", "Lower Zambezi", "Kafue", "Liuwa Plain"],
      signature: "Walking safari nato qui, a piedi tra leoni e bufali con guide armate",
      wildlife: ["Leopardi (capitale del leopardo)", "Leoni", "Wild dog", "Ippopotami", "Coccodrilli"],
      whyCombine: "Esperienza tecnica e remota per chi conosce già l'Africa, controbilanciata dal lusso quieto delle Mauritius.",
      accent: "warm-brown",
    },
  },
];

/** Mauritius — Port Louis area [lon, lat] */
export const MAURITIUS_COORDS: [number, number] = [57.55, -20.35];
