export type SafariCountry = {
  id: "tanzania" | "kenya" | "uganda" | "rwanda" | "zambia";
  name: string;
  // Coordinates within the SVG viewBox 0 0 1000 700 (geographically calibrated)
  cx: number;
  cy: number;
  // Simplified-but-geographically-coherent country path
  path: string;
  intro: string;
  tags: string[];
  idealFor: string;
  finale: string;
  options: { title: string; days: string; detail: string }[];
};

/*
 Coordinate system (viewBox 1000 x 700) calibrated so that:
   - longitude  20°E → x=200    longitude 60°E → x=820
   - latitude   10°N → y=170    latitude  30°S → y=620
 This gives a roughly geographically correct East/Southern Africa + Indian Ocean layout.
 Mauritius (~57.5°E, 20.3°S) sits clearly in the Indian Ocean, east of Madagascar.
*/

export const COUNTRIES: SafariCountry[] = [
  {
    id: "uganda",
    name: "Uganda",
    // ~32.5°E, 1.3°N
    cx: 394,
    cy: 290,
    path: "M362,268 L420,266 L438,278 L432,302 L412,316 L378,314 L360,300 Z",
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
  },
  {
    id: "rwanda",
    name: "Ruanda",
    // ~30°E, 2°S
    cx: 388,
    cy: 326,
    path: "M376,316 L406,314 L412,330 L398,342 L378,338 Z",
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
  },
  {
    id: "kenya",
    name: "Kenya",
    // ~38°E, 1°S
    cx: 472,
    cy: 296,
    path: "M438,272 L520,268 L548,290 L540,322 L498,336 L460,326 L438,302 Z",
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
  },
  {
    id: "tanzania",
    name: "Tanzania",
    // ~35°E, 6°S
    cx: 444,
    cy: 372,
    path: "M376,338 L460,330 L520,338 L538,360 L526,402 L488,420 L432,418 L388,398 L370,366 Z",
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
  },
  {
    id: "zambia",
    name: "Zambia",
    // ~28°E, 14°S
    cx: 358,
    cy: 462,
    path: "M298,420 L370,414 L430,420 L444,442 L432,476 L398,500 L348,496 L310,476 L292,448 Z",
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
  },
];

// Mauritius (~57.5°E, 20.3°S) — clearly in the Indian Ocean, east of Madagascar
export const MAURITIUS = { cx: 780, cy: 538 };

// Madagascar reference shape — large island east of mainland Africa (~43–50°E, 12–25°S)
export const MADAGASCAR_PATH =
  "M642,420 C660,408 678,420 686,448 C694,476 692,508 684,540 C676,570 660,590 644,584 C634,556 632,520 632,484 C632,456 634,432 642,420 Z";

// Rough African continent silhouette (East + Southern focus) — geographically coherent.
// Coordinates fit viewBox 1000x700 with the same projection used above.
export const AFRICA_PATH =
  // North-east horn → down the east coast → Cape → up west coast → back up
  "M520,150 L560,158 L585,182 L600,210 L605,238 L580,260 L560,278 L548,300 L555,330 L560,360 L552,398 L548,432 L540,468 L520,500 L500,530 L478,560 L450,584 L420,600 L388,610 L356,612 L326,604 L302,586 L284,560 L274,530 L268,498 L260,464 L248,430 L232,394 L218,358 L208,322 L202,288 L198,256 L208,228 L228,206 L256,192 L290,182 L322,176 L356,170 L388,164 L420,158 L452,154 L486,152 Z";
