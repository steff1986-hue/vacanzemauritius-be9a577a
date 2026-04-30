import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logoHoae from "@/assets/logo-hoae.png";

const links = [
  { href: "#concept", label: "Concept" },
  { href: "#mappa", label: "Mappa" },
  { href: "#prodotti", label: "Combinazioni & Prodotti" },
  { href: "#founder", label: "Chi Siamo" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-smooth ${
        scrolled ? "glass border-b border-border/40" : "bg-transparent"
      }`}
    >
      <nav className="container-narrow flex items-center justify-between h-16 lg:h-20">
        <a href="#top" className="flex items-center gap-3 group">
          <img
            src={logoHoae}
            alt="Heart of Africa Expedition"
            className={`h-10 lg:h-12 w-auto transition-smooth ${scrolled ? "" : "drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"}`}
            loading="eager"
          />
          <span className="hidden sm:flex flex-col leading-none">
            <span className={`font-display font-semibold text-[15px] ${scrolled ? "text-foreground" : "text-white"}`}>
              Heart of Africa
            </span>
            <span className={`text-[10px] uppercase tracking-[0.2em] ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>
              Expedition · Mauritius
            </span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm font-medium transition-smooth hover:text-accent ${
                  scrolled ? "text-foreground" : "text-white/90"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <a
            href="#richiesta"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-medium shadow-soft hover:bg-accent/90 transition-smooth"
          >
            Richiedi un viaggio
          </a>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 rounded-md ${scrolled ? "text-foreground" : "text-white"}`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-border/40 animate-fade-in">
          <ul className="container-narrow py-6 flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium text-foreground py-2"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#richiesta"
                onClick={() => setOpen(false)}
                className="block text-center rounded-full bg-accent text-accent-foreground px-5 py-3 text-sm font-medium shadow-soft"
              >
                Richiedi un viaggio
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
