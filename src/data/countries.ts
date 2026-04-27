export type SafariCountry = {
  id: "tanzania" | "kenya" | "uganda" | "rwanda" | "zambia";
  name: string;
  // Coordinates within the SVG viewBox 0 0 800 600
  cx: number;
  cy: number;
  // Polygon points (rough country shape) for highlight
  path: string;
  intro: string;
  tags: string[];
  idealFor: string;
  finale: string;
  options: { title: string; days: string; detail: string }[];
};

export const COUNTRIES: SafariCountry[] = [
  {
    id: "tanzania",
    name: "Tanzania",
    cx: 470,
    cy: 360,
    path: "M430,300 L520,295 L545,340 L555,395 L520,425 L460,420 L425,385 L420,340 Z",
    intro:
      "La combinazione più forte per il mercato italiano. Safari iconico o remoto e finale mare più esclusivo della classica estensione Zanzibar.",
    tags: ["Nord", "Sud", "Ovest", "Honeymoon"],
    idealFor: "Primo safari, honeymoon, coppie premium. Equilibrio tra emozione e comfort.",
    finale:
      "4–6 notti alle Mauritius in resort selezionati: The Residence o equivalenti luxury.",
    options: [
      { title: "Nord classico", days: "5–7 giorni", detail: "Tarangire · Ngorongoro · Serengeti" },
      { title: "Sud remoto", days: "8–10 giorni", detail: "Nyerere · Ruaha, lodge piccoli e tribali" },
      { title: "Ovest esclusivo", days: "10–12 giorni", detail: "Katavi · Mahale, scimpanzé e wilderness pura" },
    ],
  },
  {
    id: "kenya",
    name: "Kenya",
    cx: 510,
    cy: 290,
    path: "M470,255 L560,250 L580,290 L555,330 L495,335 L470,300 Z",
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
    id: "uganda",
    name: "Uganda",
    cx: 460,
    cy: 285,
    path: "M425,265 L475,260 L490,290 L470,315 L430,310 L415,290 Z",
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
    cx: 455,
    cy: 320,
    path: "M438,308 L470,305 L478,328 L460,340 L438,335 Z",
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
    id: "zambia",
    name: "Zambia",
    cx: 490,
    cy: 420,
    path: "M440,395 L545,390 L560,425 L530,455 L460,455 L435,425 Z",
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

// Mauritius destination point (Indian Ocean)
export const MAURITIUS = { cx: 690, cy: 470 };
