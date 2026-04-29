import { Mail, MessageCircle, Globe } from "lucide-react";
import logoHoae from "@/assets/logo-hoae.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-narrow py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-primary-foreground/10 rounded-2xl p-2 backdrop-blur-sm">
                <img
                  src={logoHoae}
                  alt="Heart of Africa Expedition"
                  className="h-12 w-auto"
                  loading="lazy"
                />
              </div>
              <div className="leading-none">
                <div className="font-display text-base font-semibold">Heart of Africa Expedition</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary-foreground/60 mt-1">
                  vacanzemauritius.it
                </div>
              </div>
            </div>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed">
              Viaggi su misura tra Africa profonda e Oceano Indiano. Safari + Mauritius luxury,
              progettazione umana, partner selezionati sul campo.
            </p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary-foreground/50 mb-4">Naviga</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#concept" className="hover:text-celeste transition-smooth">Concept</a></li>
              <li><a href="#mappa" className="hover:text-celeste transition-smooth">Mappa</a></li>
              <li><a href="#prodotti" className="hover:text-celeste transition-smooth">Prodotti</a></li>
              
              <li><a href="#richiesta" className="hover:text-celeste transition-smooth">Richiesta</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary-foreground/50 mb-4">Contatti</div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:info@hoaexp.com" className="flex items-center gap-2 hover:text-celeste transition-smooth">
                  <Mail size={14} /> info@hoaexp.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/971555975546" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-celeste transition-smooth">
                  <MessageCircle size={14} /> Contattami su WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Globe size={14} /> vacanzemauritius.it
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/15 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Heart of Africa Expedition · Tutti i diritti riservati.</p>
          <p>Dal remoto del continente africano all'Oceano Indiano.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
