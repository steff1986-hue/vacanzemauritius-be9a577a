import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container-narrow pt-32 pb-20">
        <div className="max-w-3xl">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
            ← Torna alla home
          </Link>
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-foreground mt-6 leading-[1.1]">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-neutral mt-10 max-w-none text-foreground/90 leading-relaxed space-y-6">
            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">1. Titolare del trattamento</h2>
              <p>
                Il titolare del trattamento dei dati personali è <strong>Heart of Africa Expedition</strong> (vacanzemauritius.it).
                Per qualsiasi richiesta in materia di privacy puoi scrivere a{" "}
                <a href="mailto:info@hoaexp.com" className="text-accent hover:underline">info@hoaexp.com</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">2. Dati raccolti</h2>
              <p>Raccogliamo i dati che ci fornisci volontariamente attraverso il modulo di richiesta:</p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Nome e cognome</li>
                <li>Indirizzo email e numero di telefono</li>
                <li>Informazioni sul viaggio desiderato (destinazione, periodo, budget, numero di viaggiatori)</li>
                <li>Eventuali messaggi e preferenze comunicate</li>
              </ul>
              <p className="mt-3">
                Inoltre raccogliamo automaticamente dati tecnici di navigazione (indirizzo IP, browser, pagine visitate)
                tramite cookie tecnici e, previo consenso, di analisi.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">3. Finalità del trattamento</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Rispondere alle tue richieste di preventivo e contatto</li>
                <li>Progettare e gestire il viaggio richiesto</li>
                <li>Adempiere a obblighi di legge (fiscali, contabili)</li>
                <li>Migliorare il sito e i nostri servizi (previo consenso)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">4. Base giuridica</h2>
              <p>
                Il trattamento si basa sull'esecuzione di misure precontrattuali e contrattuali (art. 6.1.b GDPR),
                sull'adempimento di obblighi di legge (art. 6.1.c GDPR) e sul consenso (art. 6.1.a GDPR) per i cookie
                non tecnici.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">5. Conservazione dei dati</h2>
              <p>
                I dati sono conservati per il tempo necessario alla gestione della richiesta e, in caso di viaggio
                prenotato, per il periodo previsto dagli obblighi fiscali e di legge (10 anni). I dati di marketing,
                se prestato il consenso, sono conservati per 24 mesi.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">6. Destinatari dei dati</h2>
              <p>
                I dati possono essere comunicati a partner operativi (lodge, resort, tour operator locali, compagnie
                aeree) esclusivamente per l'esecuzione del viaggio. Non vendiamo né cediamo dati a terzi per finalità
                di marketing.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">7. Trasferimento extra-UE</h2>
              <p>
                Per natura del servizio, alcuni dati possono essere trasferiti a partner situati in paesi extra-UE
                (Mauritius, Tanzania, Kenya, Zambia, Uganda, Ruanda). Tali trasferimenti avvengono nel rispetto delle
                garanzie previste dagli artt. 44-49 GDPR.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">8. Diritti dell'interessato</h2>
              <p>
                In qualsiasi momento puoi esercitare i diritti previsti dagli artt. 15-22 GDPR: accesso, rettifica,
                cancellazione, limitazione, portabilità, opposizione e revoca del consenso. Per esercitarli scrivi a{" "}
                <a href="mailto:info@hoaexp.com" className="text-accent hover:underline">info@hoaexp.com</a>.
                Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium mt-8 mb-3">9. Cookie</h2>
              <p>
                Per informazioni dettagliate sull'uso dei cookie consulta la nostra{" "}
                <Link to="/cookie-policy" className="text-accent hover:underline">Cookie Policy</Link>.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
