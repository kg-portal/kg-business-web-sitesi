import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "So funktioniert’s – in vier Schritten zum passenden Energievertrag",
  description:
    "Bedarf mitteilen, Vertrag prüfen, Angebot erhalten, Wechsel begleiten: So arbeitet KG Business – transparent, ohne Abschlusszwang und mit persönlichem Ansprechpartner.",
  path: "/so-funktionierts",
});

const faq = [
  {
    question: "Wie lange dauert es bis zum Angebot?",
    answer:
      "Das hängt vor allem von den vorliegenden Unterlagen ab. Mit vollständiger Rechnung geht es deutlich schneller. Bei leistungsgemessenen Zählern muss gegebenenfalls zuerst der Lastgang beim Messstellenbetreiber angefordert werden.",
  },
  {
    question: "Wer schließt den Vertrag mit dem Versorger?",
    answer: "Sie selbst. Der Liefervertrag kommt direkt zwischen Ihnen und dem Energieversorger zustande. Wir bereiten die Unterlagen vor und begleiten den Abschluss.",
  },
  {
    question: "Werden meine Daten an Versorger weitergegeben?",
    answer:
      "Nur soweit es für die Einholung von Angeboten oder den Vertragsabschluss erforderlich ist – und nur zu dem Zweck, den Sie beauftragt haben. Einzelheiten finden Sie in der Datenschutzerklärung.",
  },
];

export default function SoFunktioniertsPage() {
  return (
    <>
      <PageHero
        eyebrow="So funktioniert’s"
        title={
          <>
            Vier Schritte. <span className="text-energy-300">Ein Ansprechpartner.</span> Keine Verpflichtung.
          </>
        }
        lead="Von der ersten Anfrage bis zur Bestätigung durch den neuen Versorger: So begleiten wir Sie – transparent und in Ihrem Tempo."
        breadcrumbs={[{ name: "So funktioniert’s", path: "/so-funktionierts" }]}
        actions={
          <ButtonLink href="/energie-check" size="lg" icon="arrow">
            Jetzt starten
          </ButtonLink>
        }
      />
      <section className="py-20 sm:py-24" aria-labelledby="schritte-title">
        <div className="container-page">
          <SectionHeading id="schritte-title" eyebrow="Der Ablauf" title="Was in jedem Schritt passiert" align="center" />
          <div className="mt-12">
            <ProcessSteps detailed />
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 sm:py-24" aria-labelledby="unterlagen-title">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="unterlagen-title"
              eyebrow="Unterlagen"
              title="Was wir von Ihnen brauchen – und was nicht."
              lead="Je vollständiger die Angaben, desto schneller das Angebot. Pflicht ist aber nur, was für Ihre Anfrage wirklich nötig ist."
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <p className="flex items-center gap-2 font-display font-bold text-navy-900">
                <Icon name="checkCircle" className="size-5 text-energy-700" />
                Hilfreich
              </p>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink">
                <li>Letzte Jahresrechnung (PDF oder Foto)</li>
                <li>Jahresverbrauch in kWh</li>
                <li>Postleitzahl der Lieferstelle</li>
                <li>Vertragsende / Kündigungsfrist</li>
                <li>Bei RLM: Lastgang (12 Monate)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <p className="flex items-center gap-2 font-display font-bold text-navy-900">
                <Icon name="lock" className="size-5 text-electric-600" />
                Nicht nötig
              </p>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink">
                <li>Bankverbindung – gerne schwärzen</li>
                <li>Ausweisdokumente</li>
                <li>Zahlungen oder Vorkasse</li>
                <li>Zusage zum Wechsel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="verguetung-title">
        <div className="container-page">
          <div className="grid gap-10 rounded-[2rem] border border-line bg-white p-8 shadow-card sm:p-12 lg:grid-cols-[1fr_1.2fr]">
            <SectionHeading id="verguetung-title" eyebrow="Transparenz" title="Wie wir vergütet werden" />
            <div className="space-y-4 text-lg leading-relaxed text-ink/90">
              <p>{company.compensation}</p>
              <p>
                {company.brandName} ist kein Energieversorger und kein neutrales Vergleichsportal. Wir beraten Sie persönlich und vermitteln
                Verträge mit den Versorgern, deren Angebote wir für Ihre Lieferstelle einholen. Welche Versorger das sind, sagen wir Ihnen im
                Angebot.
              </p>
              <p className="text-base text-muted">
                Mehr zu Ihren Rechten in unseren{" "}
                <Link href="/agb" className="link-inline">
                  AGB
                </Link>{" "}
                und der{" "}
                <Link href="/datenschutz" className="link-inline">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Fragen zum Ablauf" />
          <FaqList items={faq} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
