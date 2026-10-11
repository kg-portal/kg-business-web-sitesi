import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { ReviewNote } from "@/components/legal/ReviewNote";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Allgemeine Geschäftsbedingungen (AGB)",
  description: `Allgemeine Geschäftsbedingungen von ${company.legalName} für die Beratung und Vermittlung von Strom- und Gasverträgen.`,
  path: "/agb",
});

/** Inhalt aus den V1-AGB übernommen (Wortlaut sinngemäß unverändert). */
export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen" path="/agb" updated="Oktober 2026">
      <ReviewNote>
        Text inhaltlich aus den AGB der V1-Website übernommen. Vor Livegang anwaltlich prüfen lassen – insbesondere, ob AGB tatsächlich
        verwendet werden, sowie Vollmacht, Haftung und Verbraucherinformationen.
      </ReviewNote>

      <h2>1. Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Dienstleistungen von {company.legalName}, Inhaberin: {company.owner},{" "}
        {company.address.street}, {company.address.postalCode} {company.address.city}, im Bereich der Vermittlung von Energieverträgen (Strom/Gas)
        an Privat- und Gewerbekunden.
      </p>

      <h2>2. Leistungsbeschreibung / Vermittlungstätigkeit</h2>
      <p>
        {company.legalName} ist kein Energieversorger, sondern tritt ausschließlich als Vermittlerin zwischen Kunden und Energieanbietern auf. Die
        Aufgabe von {company.legalName} besteht darin, Kunden bei der Auswahl geeigneter Energieverträge zu beraten und beim Vertragsabschluss mit
        dem jeweiligen Anbieter zu unterstützen. Der eigentliche Liefervertrag kommt ausschließlich zwischen dem Kunden und dem Energieanbieter
        zustande.
      </p>

      <h2>3. Vertragsschluss</h2>
      <p>
        Ein Vertrag zwischen dem Kunden und einem Energieanbieter kommt erst zustande, wenn der Energieanbieter die Annahme erklärt.{" "}
        {company.legalName} unterstützt den Kunden bei der Übermittlung erforderlicher Daten.
      </p>

      <h2>4. Pflichten des Kunden</h2>
      <p>Der Kunde verpflichtet sich, alle für die Vertragsvermittlung notwendigen Angaben wahrheitsgemäß und vollständig bereitzustellen.</p>

      <h2>5. Vergütung / Provision</h2>
      <p>
        Für die Vermittlungsleistung erhebt {company.legalName} gegenüber dem Kunden in der Regel keine direkten Kosten. Die Vergütung erfolgt durch
        Provisionen, die {company.legalName} vom jeweiligen Energieanbieter erhält. Abweichungen hiervon werden dem Kunden vorab ausdrücklich
        mitgeteilt.
      </p>

      <h2>6. Laufzeit und Kündigung</h2>
      <p>Die Vertragslaufzeit und Kündigungsfristen ergeben sich ausschließlich aus den Bedingungen des jeweiligen Energieanbieters.</p>

      <h2>7. Datenschutz</h2>
      <p>
        Die Verarbeitung personenbezogener Daten erfolgt gemäß DSGVO sowie unserer <Link href="/datenschutz">Datenschutzerklärung</Link>.
      </p>

      <h2>8. Widerrufsrecht</h2>
      <p>
        Ist der Kunde Verbraucher im Sinne des BGB (§ 13), steht ihm ein gesetzliches Widerrufsrecht zu. Die konkreten Widerrufsbedingungen
        richten sich nach dem jeweiligen Vertrag mit dem Energieanbieter.
      </p>
    </LegalPage>
  );
}
