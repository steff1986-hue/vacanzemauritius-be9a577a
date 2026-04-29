import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  const reopenBanner = () => {
    localStorage.removeItem("cookie-consent");
    window.dispatchEvent(new Event("cookie-consent-reset"));
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container-narrow pt-32 pb-20">
        <div className="max-w-3xl">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
            ← Torna alla home
          </Link>
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-foreground mt-6 leading-[1.1]">
            Cookie Policy
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 text-foreground/90 leading-relaxed space-y-6">
            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">Cosa sono i cookie</h2>
              <p>
                I cookie sono piccoli file di testo che i siti visitati inviano al browser dell'utente, dove
                vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva. Sono utilizzati
                per eseguire autenticazioni informatiche, monitoraggio di sessioni e memorizzazione di preferenze.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">Tipologie di cookie utilizzate</h2>

              <div className="bg-muted/40 rounded-2xl p-6 mt-4 border border-border">
                <h3 className="font-display text-lg font-medium mb-2">Cookie tecnici (necessari)</h3>
                <p className="text-sm text-muted-foreground">
                  Indispensabili al corretto funzionamento del sito. Memorizzano, ad esempio, la scelta sul banner
                  cookie. Non richiedono consenso.
                </p>
              </div>

              <div className="bg-muted/40 rounded-2xl p-6 mt-4 border border-border">
                <h3 className="font-display text-lg font-medium mb-2">Cookie di analisi (statistici)</h3>
                <p className="text-sm text-muted-foreground">
                  Utilizzati in forma aggregata e anonimizzata per comprendere come gli utenti interagiscono con il
                  sito. Vengono attivati solo dopo il tuo consenso.
                </p>
              </div>

              <div className="bg-muted/40 rounded-2xl p-6 mt-4 border border-border">
                <h3 className="font-display text-lg font-medium mb-2">Cookie di marketing</h3>
                <p className="text-sm text-muted-foreground">
                  Utilizzati per mostrare contenuti pubblicitari personalizzati. Vengono attivati solo dopo il tuo
                  consenso esplicito.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">Gestione delle preferenze</h2>
              <p>
                Puoi modificare in qualsiasi momento le tue preferenze sui cookie cliccando il pulsante qui sotto.
                Puoi anche disabilitare i cookie direttamente dalle impostazioni del tuo browser.
              </p>
              <Button onClick={reopenBanner} className="mt-4">
                Modifica preferenze cookie
              </Button>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">Cookie di terze parti</h2>
              <p>
                Il sito può integrare contenuti o funzionalità di terze parti (es. Google Fonts, mappe, video). Tali
                soggetti agiscono come autonomi titolari del trattamento per i dati raccolti tramite i loro cookie.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">Maggiori informazioni</h2>
              <p>
                Per dettagli sul trattamento dei dati personali consulta la nostra{" "}
                <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>.
                Per qualsiasi richiesta scrivi a{" "}
                <a href="mailto:info@hoaexp.com" className="text-accent hover:underline">info@hoaexp.com</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default CookiePolicy;
