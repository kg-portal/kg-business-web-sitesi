import Link from "next/link";
import { EnergyBackdrop } from "@/components/art/EnergyBackdrop";
import { QuickCheck } from "@/components/forms/QuickCheck";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { OfferAnatomy } from "@/components/sections/OfferAnatomy";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SymbolImage } from "@/components/ui/SymbolImage";
import { company } from "@/content/company";
import { generalFaq } from "@/content/faq";
import { industries } from "@/content/industries";
import { articles } from "@/content/ratgeber";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "KG Business – Gewerbestrom & Gewerbegas vergleichen | Energieberatung Duisburg",
  absoluteTitle: true,
  description:
    "Strom & Gas für Unternehmen und Privathaushalte: KG Business prüft Ihre Verträge, vergleicht passende Angebote und begleitet den Anbieterwechsel – kostenlos, persönlich, aus Duisburg.",
  path: "/",
});

const entryPoints: { title: string; text: string; href: string; icon: IconName; accent?: boolean }[] = [
  { title: "Gewerbestrom", text: "Stromverträge für Betriebe, Büros und Praxen prüfen.", href: "/gewerbestrom", icon: "zap" },
  { title: "Gewerbegas", text: "Gas für Heizung und Prozesswärme vergleichen.", href: "/gewerbegas", icon: "flame" },
  { title: "Privatkunden", text: "Strom und Gas für den eigenen Haushalt.", href: "/privatkunden", icon: "home" },
  { title: "Energie-Check", text: "Kostenlos starten – Rechnung genügt.", href: "/energie-check", icon: "clipboard", accent: true },
];

const services: { title: string; text: string; icon: IconName; href: string }[] = [
  {
    title: "Tarifvergleich",
    text: "Wir holen passende Angebote verschiedener Versorger für Ihre Lieferstelle ein und stellen sie nachvollziehbar gegenüber.",
    icon: "scale",
    href: "/so-funktionierts",
  },
  {
    title: "Vertrags- und Rechnungsprüfung",
    text: "Arbeitspreis, Grundpreis, Laufzeit, Preisgarantie und Kündigungsfrist – wir lesen das Kleingedruckte für Sie.",
    icon: "fileSearch",
    href: "/ratgeber/stromrechnung-lesen",
  },
  {
    title: "Anbieterwechsel begleiten",
    text: "Von der Kündigung bis zur Bestätigung durch den neuen Versorger: Wir begleiten jeden Schritt.",
    icon: "route",
    href: "/ratgeber/anbieterwechsel",
  },
  {
    title: "Gewerbekunden mit Lastgang",
    text: "Für leistungsgemessene Zähler (RLM) beziehen wir Lastgang und Leistungspreis in die Bewertung ein.",
    icon: "chart",
    href: "/gewerbestrom#rlm",
  },
  {
    title: "Mehrere Standorte bündeln",
    text: "Filialen, Objekte oder Werkstatt und Büro: Wir erfassen alle Lieferstellen und Vertragsenden übersichtlich.",
    icon: "buildings",
    href: "/branchen",
  },
  {
    title: "Persönliche Beratung",
    text: "Ein fester Ansprechpartner statt Hotline – telefonisch, per E-Mail oder im persönlichen Gespräch.",
    icon: "user",
    href: "/kontakt",
  },
];

const reasons: { title: string; text: string; icon: IconName }[] = [
  {
    title: "Transparent bezahlt",
    text: "Für Sie in der Regel kostenfrei: Wir werden bei erfolgreicher Vermittlung vom Versorger vergütet – und sagen das offen.",
    icon: "euro",
  },
  {
    title: "Kein Abschlusszwang",
    text: "Sie erhalten eine klare Entscheidungsgrundlage und entscheiden selbst, ob und wann Sie wechseln.",
    icon: "shield",
  },
  {
    title: "Verständlich erklärt",
    text: "Wir übersetzen Tarifdetails in klare Aussagen – damit Sie wissen, was Sie unterschreiben.",
    icon: "lightbulb",
  },
  {
    title: "Persönlich aus Duisburg",
    text: "Sitz in Duisburg, Schwerpunkt NRW, bundesweit für Sie erreichbar – mit festem Ansprechpartner.",
    icon: "mapPin",
  },
];

export default function HomePage() {
  const teaserArticles = articles.slice(0, 3);
  return (
    <>
      {/* HERO */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-900 text-white" aria-labelledby="hero-title">
        <EnergyBackdrop variant="home" />
        <div className="container-page relative grid items-center gap-12 pb-28 pt-28 sm:pt-36 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:pb-40 lg:pt-44">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[0.8rem] font-semibold text-on-dark backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-energy-400 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-energy-400" />
              </span>
              Energieberatung für Gewerbe & Privat · Duisburg & NRW
            </p>
            <h1 id="hero-title" className="mt-7 text-[2.55rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.35rem]">
              Strom & Gas für Unternehmen.{" "}
              <span className="bg-gradient-to-r from-electric-300 via-white to-energy-300 bg-clip-text text-transparent">
                Klar verglichen. Persönlich begleitet.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-on-dark sm:text-xl">
              {company.brandName} prüft Ihre Strom- und Gasverträge, holt passende Angebote verschiedener Versorger ein und
              begleitet Sie bis zum Anbieterwechsel – für Gewerbe und Privathaushalte.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/energie-check" size="lg" icon="arrow">
                Jetzt kostenlosen Energie-Check starten
              </ButtonLink>
              <ButtonLink href="/kontakt" size="lg" variant="ghost-dark" iconLeft="phone">
                Persönlich beraten lassen
              </ButtonLink>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-on-dark">
              {["Kostenfreie Erstprüfung", "Kein Abschlusszwang", "Fester Ansprechpartner"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-energy-400/20 text-energy-300">
                    <Icon name="check" className="size-3.5" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <QuickCheck />
          </div>
        </div>
      </section>

      {/* EINSTIEGE */}
      <section aria-label="Schnelleinstieg" className="relative z-10 -mt-16 lg:-mt-20">
        <div className="container-page">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {entryPoints.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  className={
                    e.accent
                      ? "group flex h-full flex-col rounded-2xl bg-energy-400 p-6 text-navy-900 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:bg-energy-300"
                      : "group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:border-electric-500/40"
                  }
                >
                  <span
                    className={
                      e.accent
                        ? "inline-flex size-11 items-center justify-center rounded-xl bg-navy-900 text-energy-400"
                        : "inline-flex size-11 items-center justify-center rounded-xl bg-electric-500/10 text-electric-600"
                    }
                  >
                    <Icon name={e.icon} className="size-5" />
                  </span>
                  <span className="mt-5 flex items-center justify-between font-display text-lg font-bold text-navy-900">
                    {e.title}
                    <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className={e.accent ? "mt-1.5 text-[0.95rem] text-navy-900/80" : "mt-1.5 text-[0.95rem] text-muted"}>{e.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="py-20 sm:py-28" aria-labelledby="leistungen-title" id="leistungen">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="leistungen-title"
              eyebrow="Leistungen"
              title="Energieberatung, die Ihnen Arbeit abnimmt – nicht macht."
              lead="Wir kümmern uns um Vergleich, Prüfung und Wechsel. Sie behalten den Überblick und treffen die Entscheidung."
            />
            <ButtonLink href="/so-funktionierts" variant="secondary" icon="arrow" className="shrink-0 self-start lg:self-auto">
              So funktioniert’s
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.title}>
                <Link
                  href={s.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-electric-500 to-energy-400 transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-[0_8px_20px_-8px_rgb(18_59_145/0.7)]">
                    <Icon name={s.icon} className="size-5.5" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2.5 flex-1 leading-relaxed text-muted">{s.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600">
                    Mehr erfahren
                    <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ANGEBOTS-ANATOMIE */}
      <section className="relative overflow-hidden bg-soft py-20 sm:py-28" aria-labelledby="vergleich-title">
        <div className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="vergleich-title"
              eyebrow="Worauf es ankommt"
              title="Der günstigste Preis pro kWh ist nicht automatisch das beste Angebot."
              lead="Ein Energieangebot besteht aus mehreren Bausteinen. Wir vergleichen das Gesamtpaket – damit Sie im zweiten Vertragsjahr keine Überraschung erleben."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Grundpreis und Arbeitspreis gemeinsam bewerten – abhängig von Ihrem Verbrauch",
                "Boni getrennt ausweisen, weil sie meist nur im ersten Jahr gelten",
                "Umfang der Preisgarantie prüfen: Welche Bestandteile sind wirklich fix?",
                "Laufzeit, Verlängerung und Kündigungsfrist an Ihre Planung anpassen",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-energy-400 text-navy-900">
                    <Icon name="check" className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed text-ink">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <ButtonLink href="/ratgeber/arbeitspreis-grundpreis" variant="navy" icon="arrow">
                Arbeitspreis & Grundpreis erklärt
              </ButtonLink>
            </div>
          </div>
          <OfferAnatomy />
        </div>
      </section>

      {/* PROZESS */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-900 py-20 text-white sm:py-28" aria-labelledby="ablauf-title">
        <EnergyBackdrop variant="page" className="opacity-70" />
        <div className="container-page relative">
          <SectionHeading
            id="ablauf-title"
            eyebrow="So funktioniert’s"
            title="In vier Schritten zum passenden Energievertrag."
            lead="Klar strukturiert, ohne Fachchinesisch – und Sie entscheiden an jeder Stelle selbst."
            align="center"
          />
          <div className="mt-14">
            <ProcessSteps tone="dark" />
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/energie-check" size="lg" icon="arrow">
              Energie-Check starten
            </ButtonLink>
            <ButtonLink href="/so-funktionierts" size="lg" variant="ghost-dark">
              Ablauf im Detail
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* BRANCHEN */}
      <section className="py-20 sm:py-28" aria-labelledby="branchen-title">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="branchen-title"
              eyebrow="Branchenlösungen"
              title="Jede Branche verbraucht Energie anders."
              lead="Kühlung rund um die Uhr, Maschinen mit Lastspitzen oder viele Lieferstellen: Wir berücksichtigen, wie Ihr Betrieb tatsächlich arbeitet."
            />
            <ButtonLink href="/branchen" variant="secondary" icon="arrow" className="shrink-0 self-start lg:self-auto">
              Alle Branchen
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <li key={ind.slug}>
                <Link
                  href={`/branchen/${ind.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:border-electric-500/40 hover:bg-soft/50 hover:shadow-card"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-soft text-navy-700 transition-colors group-hover:bg-navy-900 group-hover:text-white">
                    <Icon name={ind.icon} className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-display font-bold text-navy-900">
                      {ind.name}
                      <Icon name="arrow" className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted">{ind.teaser}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WARUM KG BUSINESS */}
      <section className="bg-soft py-20 sm:py-28" aria-labelledby="warum-title">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative order-2 lg:order-1">
            <SymbolImage
              src="/images/beratung-laptop.jpg"
              alt="Beratungsgespräch zu Energieverträgen am Laptop"
              className="aspect-[4/3] rounded-3xl shadow-lift"
            />
            <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-line bg-white/95 p-5 shadow-lift backdrop-blur sm:left-auto sm:right-[-1.5rem] sm:w-80">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                <Icon name="info" className="size-4 text-electric-600" />
                So verdienen wir unser Geld
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{company.compensation}</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              id="warum-title"
              eyebrow={`Warum ${company.brandName}`}
              title="Ehrliche Beratung beginnt mit Transparenz."
              lead="Wir versprechen keine pauschalen Ersparnisse. Wir versprechen, dass Sie verstehen, was Ihnen angeboten wird – und warum."
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {reasons.map((r) => (
                <li key={r.title} className="rounded-2xl border border-line bg-white p-5 shadow-card">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-energy-400/15 text-energy-700">
                    <Icon name={r.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRIVATKUNDEN */}
      <section className="py-20 sm:py-28" aria-labelledby="privat-title">
        <div className="container-page">
          <div className="grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-card lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <SectionHeading
                id="privat-title"
                eyebrow="Privatkunden"
                title="Auch für Ihr Zuhause: Strom und Gas ohne Tarifdschungel."
                lead="Grundversorgung, auslaufende Preisgarantie oder Umzug? Wir prüfen Ihren Haushaltstarif und zeigen Ihnen passende Alternativen."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/energie-check?kundentyp=privat" icon="arrow">
                  Privat-Check starten
                </ButtonLink>
                <ButtonLink href="/privatkunden" variant="secondary">
                  Mehr für Privatkunden
                </ButtonLink>
              </div>
            </div>
            <SymbolImage
              src="/images/privatkunden-familie.jpg"
              alt="Familie lässt sich zu Strom- und Gastarifen für den Haushalt beraten"
              className="min-h-72 lg:min-h-full"
            />
          </div>
        </div>
      </section>

      {/* RATGEBER */}
      <section className="border-t border-line bg-white py-20 sm:py-28" aria-labelledby="ratgeber-title">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="ratgeber-title"
              eyebrow="Ratgeber"
              title="Wissen, das bei der Entscheidung hilft."
              lead="Verständliche Erklärungen zu Rechnung, Vertrag und Anbieterwechsel – mit Quellen."
            />
            <ButtonLink href="/ratgeber" variant="secondary" icon="arrow" className="shrink-0 self-start lg:self-auto">
              Zum Ratgeber
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {teaserArticles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/ratgeber/${a.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="eyebrow">{a.category}</span>
                  <h3 className="mt-3 text-xl font-bold leading-snug group-hover:text-electric-600">{a.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{a.excerpt}</p>
                  <span className="mt-6 flex items-center justify-between text-sm">
                    <span className="text-muted">{a.readingMinutes} Min. Lesezeit</span>
                    <Icon name="arrow" className="size-5 text-electric-600 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-soft py-20 sm:py-28" aria-labelledby="faq-title" id="faq">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title="Häufige Fragen"
              lead={
                <>
                  Ihre Frage ist nicht dabei? Rufen Sie uns an unter{" "}
                  <a className="link-inline" href={company.phone.href}>
                    {company.phone.display}
                  </a>{" "}
                  oder schreiben Sie an{" "}
                  <a className="link-inline" href={`mailto:${company.email}`}>
                    {company.email}
                  </a>
                  .
                </>
              }
            />
          </div>
          <FaqList items={generalFaq} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
