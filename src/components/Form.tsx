import { useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";

const EMAIL = "info@hoaexp.com";
const WHATSAPP = "255774295123";

const Form = () => {
  const [data, setData] = useState({
    nome: "",
    email: "",
    telefono: "",
    tipo: "Safari + Mauritius",
    nazione: "Tanzania",
    budget: "€4.800 – €7.500",
    messaggio: "",
  });

  const buildBody = () => {
    return [
      `Nome: ${data.nome}`,
      `Email: ${data.email}`,
      `Telefono / WhatsApp: ${data.telefono}`,
      `Tipo viaggio: ${data.tipo}`,
      `Nazione safari: ${data.nazione}`,
      `Budget: ${data.budget}`,
      "",
      "Messaggio:",
      data.messaggio,
    ].join("%0D%0A");
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Richiesta viaggio — ${data.tipo}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${buildBody()}`;
  };

  const handleWhatsapp = () => {
    const text = encodeURIComponent(
      `Ciao Heart of Africa Expedition, vorrei una proposta.\n\nNome: ${data.nome}\nEmail: ${data.email}\nTelefono: ${data.telefono}\nTipo viaggio: ${data.tipo}\nNazione safari: ${data.nazione}\nBudget: ${data.budget}\n\nMessaggio:\n${data.messaggio}`
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
  };

  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData({ ...data, [k]: e.target.value });

  return (
    <section id="richiesta" className="relative py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-savanna-ocean)" }} />
      <div className="container-narrow relative">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2">
            <div className="eyebrow text-celeste mb-5">
              <span className="hairline bg-celeste/60" /> Richiesta
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-medium leading-[1.08] text-balance">
              Raccontaci il viaggio.<br />
              <span className="italic font-normal text-celeste">Ti rispondiamo da persona a persona.</span>
            </h2>
            <p className="mt-5 text-primary-foreground/80 leading-relaxed">
              Niente form-tunnel. Compila quello che ti serve e scegli come vuoi essere ricontattato:
              email o WhatsApp diretto.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-primary-foreground/90 hover:text-celeste transition-smooth"
              >
                <Mail size={18} /> {EMAIL}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                className="flex items-center gap-3 text-primary-foreground/90 hover:text-celeste transition-smooth"
                target="_blank"
                rel="noopener"
              >
                <MessageCircle size={18} /> +255 774 295 123
              </a>
            </div>
          </div>

          <form
            onSubmit={handleEmail}
            className="lg:col-span-3 bg-background text-foreground rounded-3xl p-7 lg:p-9 shadow-elevated"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nome" required>
                <input
                  required
                  value={data.nome}
                  onChange={set("nome")}
                  className="form-input"
                  placeholder="Nome e cognome"
                />
              </Field>
              <Field label="Email" required>
                <input
                  required
                  type="email"
                  value={data.email}
                  onChange={set("email")}
                  className="form-input"
                  placeholder="tu@esempio.com"
                />
              </Field>
              <Field label="Telefono / WhatsApp">
                <input
                  value={data.telefono}
                  onChange={set("telefono")}
                  className="form-input"
                  placeholder="+39 ..."
                />
              </Field>
              <Field label="Tipo viaggio">
                <select value={data.tipo} onChange={set("tipo")} className="form-input">
                  <option>Safari + Mauritius</option>
                  <option>Mauritius Tailor Made</option>
                  <option>Non so ancora</option>
                </select>
              </Field>
              <Field label="Nazione safari">
                <select value={data.nazione} onChange={set("nazione")} className="form-input">
                  <option>Tanzania</option>
                  <option>Kenya</option>
                  <option>Zambia</option>
                  <option>Uganda</option>
                  <option>Ruanda</option>
                  <option>Solo Mauritius</option>
                </select>
              </Field>
              <Field label="Budget indicativo">
                <select value={data.budget} onChange={set("budget")} className="form-input">
                  <option>€2.500 – €4.500</option>
                  <option>€4.800 – €7.500</option>
                  <option>€7.500+</option>
                  <option>Da definire</option>
                </select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Messaggio">
                <textarea
                  rows={4}
                  value={data.messaggio}
                  onChange={set("messaggio")}
                  className="form-input resize-none"
                  placeholder="Periodo, persone, idee, ispirazioni..."
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3.5 text-sm font-medium hover:bg-accent/90 transition-smooth shadow-soft"
              >
                <Send size={16} /> Invia per email
              </button>
              <button
                type="button"
                onClick={handleWhatsapp}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-smooth"
              >
                <MessageCircle size={16} /> Scrivici su WhatsApp
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Ti risponderemo a mano, non con un autoresponder.
            </p>
          </form>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: hsl(var(--muted) / 0.5);
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: hsl(var(--foreground));
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: hsl(var(--accent));
          background: hsl(var(--background));
          box-shadow: 0 0 0 3px hsl(var(--accent) / 0.15);
        }
      `}</style>
    </section>
  );
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
      {label} {required && <span className="text-accent">*</span>}
    </span>
    {children}
  </label>
);

export default Form;
