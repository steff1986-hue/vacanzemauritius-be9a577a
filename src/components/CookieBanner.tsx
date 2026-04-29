import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Cookie, X } from "lucide-react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

const STORAGE_KEY = "cookie-consent";

const readConsent = (): ConsentState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);
    const onReset = () => {
      setAnalytics(false);
      setMarketing(false);
      setShowSettings(false);
      setVisible(true);
    };
    window.addEventListener("cookie-consent-reset", onReset);
    return () => window.removeEventListener("cookie-consent-reset", onReset);
  }, []);

  const persist = (state: ConsentState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: state }));
  };

  const acceptAll = () => {
    persist({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() });
    setVisible(false);
  };

  const rejectAll = () => {
    persist({ necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString() });
    setVisible(false);
  };

  const saveSettings = () => {
    persist({ necessary: true, analytics, marketing, timestamp: new Date().toISOString() });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 md:p-6 pointer-events-none"
    >
      <div className="container-narrow pointer-events-auto">
        <div className="bg-card border border-border rounded-2xl shadow-elevated p-6 md:p-7 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="bg-accent/10 rounded-xl p-2.5 shrink-0">
              <Cookie size={20} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-medium text-foreground">
                  Rispettiamo la tua privacy
                </h2>
                <button
                  onClick={rejectAll}
                  aria-label="Chiudi rifiutando i cookie non necessari"
                  className="text-muted-foreground hover:text-foreground transition-smooth -mr-2 -mt-1 p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo consenso, cookie di
                analisi e marketing. Puoi accettare, rifiutare o personalizzare le preferenze.{" "}
                <Link to="/cookie-policy" className="text-accent hover:underline">Cookie Policy</Link> ·{" "}
                <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>.
              </p>

              {showSettings && (
                <div className="mt-5 space-y-3 border-t border-border pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">Necessari</div>
                      <div className="text-xs text-muted-foreground">Sempre attivi, indispensabili al sito.</div>
                    </div>
                    <Switch checked disabled aria-label="Cookie necessari (sempre attivi)" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">Analisi</div>
                      <div className="text-xs text-muted-foreground">Statistiche aggregate e anonime di utilizzo.</div>
                    </div>
                    <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Cookie di analisi" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">Marketing</div>
                      <div className="text-xs text-muted-foreground">Contenuti e annunci personalizzati.</div>
                    </div>
                    <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Cookie di marketing" />
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                <Button onClick={acceptAll} className="sm:order-3">Accetta tutti</Button>
                <Button onClick={rejectAll} variant="outline" className="sm:order-2">Rifiuta</Button>
                {showSettings ? (
                  <Button onClick={saveSettings} variant="ghost" className="sm:order-1 sm:mr-auto">
                    Salva preferenze
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="sm:order-1 sm:mr-auto"
                  >
                    Personalizza
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
