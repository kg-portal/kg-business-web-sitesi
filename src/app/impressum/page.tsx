import { LegalPage } from "@/components/legal/LegalPage";
import { ReviewNote } from "@/components/legal/ReviewNote";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Impressum",
  description: `Impressum von ${company.legalName}, Inhaberin ${company.owner}, ${company.address.street}, ${company.address.postalCode} ${company.address.city}.`,
  path: "/impressum",
});

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" path="/impressum" updated="Oktober 2026">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {company.legalName}
        <br />
        Inhaberin: {company.owner}
        <br />
        {company.address.street}
        <br />
        {company.address.postalCode} {company.address.city}
        <br />
        {company.address.country}
      </p>
      <ReviewNote>
        Angaben aus dem V1-Impressum übernommen. Bitte bestätigen: exakte Firmierung, Rechtsform (Einzelunternehmen), ggf.
        Handelsregistereintrag. Laut Suchergebnissen werden Adresse und Telefonnummer auch für „KG-Gebäudereinigung“ verwendet – bitte prüfen,
        ob die Angaben für KG Business gelten.
      </ReviewNote>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={company.phone.href}>{company.phone.international}</a>
        <br />
        E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {company.vatId}</p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        {company.owner}
        <br />
        {company.address.street}, {company.address.postalCode} {company.address.city}
      </p>
      <ReviewNote>Verantwortliche Person für redaktionelle Inhalte (Ratgeber) bestätigen.</ReviewNote>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      <ReviewNote>
        Erklärung nach § 36 VSBG bitte bestätigen (Pflicht entfällt bei ≤ 10 Beschäftigten; freiwillige Angabe). Der Link zur EU-OS-Plattform
        entfällt, da die Plattform am 20.07.2025 eingestellt wurde.
      </ReviewNote>

      <h2>Tätigkeit</h2>
      <p>
        {company.legalName} berät zu Strom- und Gaslieferverträgen und vermittelt diese. {company.legalName} ist kein Energieversorger.
      </p>
      <ReviewNote>Bei der Niederrheinischen IHK bestätigen lassen, dass für die Energievermittlung keine Erlaubnis nach §§ 34c/d/f GewO erforderlich ist.</ReviewNote>

      <h2>Bildnachweise</h2>
      <p>
        Grafiken und Illustrationen: eigene Darstellungen. Mit „Symbolbild“ gekennzeichnete Fotos zeigen keine Mitarbeitenden von{" "}
        {company.legalName}.
      </p>
      <ReviewNote>Herkunft und Nutzungsrechte der Symbolbilder (aus dem V1-Repository, vermutlich KI-generiert) bestätigen.</ReviewNote>
    </LegalPage>
  );
}
