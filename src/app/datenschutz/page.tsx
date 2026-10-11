import { LegalPage } from "@/components/legal/LegalPage";
import { ReviewNote } from "@/components/legal/ReviewNote";
import { company } from "@/content/company";
import { retention } from "@/lib/retention";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Datenschutzerklärung",
  description: `Informationen zur Verarbeitung personenbezogener Daten durch ${company.legalName} nach Art. 13 DSGVO.`,
  path: "/datenschutz",
});

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" path="/datenschutz" updated="Oktober 2026">
      <p>
        Mit dieser Datenschutzerklärung informieren wir Sie nach Art. 13 der Datenschutz-Grundverordnung (DSGVO) darüber, welche
        personenbezogenen Daten wir beim Besuch dieser Website und bei Ihrer Anfrage verarbeiten, zu welchen Zwecken und auf welcher
        Rechtsgrundlage.
      </p>

      <h2 id="verantwortlicher">1. Verantwortlicher</h2>
      <p>
        {company.legalName}, Inhaberin: {company.owner}
        <br />
        {company.address.street}, {company.address.postalCode} {company.address.city}
        <br />
        Telefon: {company.phone.international} · E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
      </p>
      <p>Ein Datenschutzbeauftragter ist nicht benannt, da hierzu keine gesetzliche Pflicht besteht.</p>
      <ReviewNote>Bestätigen, dass keine Pflicht zur Benennung eines Datenschutzbeauftragten besteht (§ 38 BDSG).</ReviewNote>

      <h2 id="hosting">2. Hosting und Server-Protokolle</h2>
      <p>
        Diese Website wird auf Servern der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, in Deutschland betrieben. Mit dem Anbieter
        besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.
      </p>
      <p>
        Beim Aufruf der Website verarbeitet der Webserver technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse,
        übertragene Datenmenge, Browsertyp). Dies dient der sicheren Bereitstellung der Website (Art. 6 Abs. 1 lit. f DSGVO). Server-Protokolle
        werden nach spätestens 14 Tagen gelöscht.
      </p>
      <ReviewNote>
        Hosting bei Hetzner ist geplant, aber noch nicht eingerichtet. Vor Livegang: AV-Vertrag in der Hetzner-Konsole abschließen und die
        tatsächliche Log-Aufbewahrung des Reverse-Proxys prüfen und hier eintragen.
      </ReviewNote>

      <h2 id="anfragen">3. Energie-Check, Kontaktformular und Anfragen</h2>
      <p>Wenn Sie uns über den Energie-Check, das Kontaktformular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir:</p>
      <ul>
        <li>Kontaktdaten: Name bzw. Ansprechpartner, Firma, E-Mail-Adresse, Telefonnummer</li>
        <li>Angaben zur Lieferstelle: Postleitzahl, Ort, Kundentyp, Energieart</li>
        <li>Vertragsdaten: aktueller Anbieter, Jahresverbrauch, Vertragsende, Preise und Kündigungsstatus (soweit angegeben)</li>
        <li>Ihre Nachricht sowie freiwillig hochgeladene Rechnungen</li>
        <li>Zeitpunkt der Anfrage und eine Referenznummer</li>
      </ul>
      <p>
        <strong>Zweck:</strong> Bearbeitung Ihrer Anfrage, Prüfung Ihrer Verträge, Einholung von Angeboten und – wenn Sie sich dafür entscheiden –
        Vorbereitung des Vertragsabschlusses mit einem Energieversorger.
        <br />
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage). Bei Ansprechpersonen von
        Unternehmen zusätzlich Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung geschäftlicher Anfragen).
        <br />
        <strong>Pflichtangaben:</strong> Die als Pflichtfeld gekennzeichneten Angaben benötigen wir, um Ihre Anfrage bearbeiten zu können. Ohne
        sie ist eine Bearbeitung nicht möglich. Alle weiteren Angaben sind freiwillig.
      </p>

      <h3>Hochgeladene Rechnungen</h3>
      <p>
        Rechnungen (PDF, JPG, PNG) werden verschlüsselt gespeichert, auf Schadsoftware geprüft und sind nicht öffentlich abrufbar. Bilder werden
        beim Hochladen neu kodiert; dabei werden eingebettete Metadaten (z. B. Standortdaten) entfernt. Bitte schwärzen Sie Angaben, die wir nicht
        benötigen – insbesondere Bankverbindungen. Hochgeladene Dateien löschen wir spätestens nach {retention.uploadDays} Tagen.
      </p>

      <h3>Speicherdauer</h3>
      <p>
        Anfragen, die nicht zu einem Vertragsabschluss führen, löschen wir {retention.leadDays} Tage nach Eingang. Kommt es zu einem
        Vertragsabschluss, bewahren wir die erforderlichen Unterlagen nach den handels- und steuerrechtlichen Fristen auf (in der Regel sechs
        Jahre für Geschäftsbriefe, acht Jahre für Buchungsbelege).
      </p>

      <h3>Empfänger</h3>
      <p>
        Ihre Anfrage wird in unserem internen Kundenverwaltungssystem (CRM) bearbeitet. An Energieversorger übermitteln wir Daten nur, soweit es
        für die Einholung eines Angebots oder den von Ihnen gewünschten Vertragsabschluss erforderlich ist. Eine Übermittlung in Länder außerhalb
        der EU/des EWR findet nicht statt.
      </p>
      <ReviewNote>
        Bitte bestätigen: Hosting/Standort des KG-Business-CRM und des E-Mail-Postfachs (Auftragsverarbeiter mit AV-Vertrag), sowie ob Versorger
        namentlich oder als Kategorie genannt werden sollen.
      </ReviewNote>

      <h2 id="werbung">4. Optionale Einwilligung in Informationen und Angebote</h2>
      <p>
        Im Energie-Check können Sie freiwillig und getrennt einwilligen, dass wir Sie per E-Mail bzw. telefonisch über passende Energieangebote
        informieren (Art. 6 Abs. 1 lit. a DSGVO, § 7 UWG). Diese Einwilligung ist keine Voraussetzung für die Bearbeitung Ihrer Anfrage. Sie
        können sie jederzeit mit Wirkung für die Zukunft widerrufen, z. B. per E-Mail an {company.email}. Zum Nachweis speichern wir Zeitpunkt
        und Wortlaut Ihrer Einwilligung bis zu {retention.consentProofYears} Jahre nach ihrer letzten Verwendung.
      </p>

      <h2 id="schutz">5. Schutz vor Missbrauch</h2>
      <p>
        Zum Schutz vor automatisierten Spam-Anfragen verwenden wir ein unsichtbares Prüffeld, eine Mindest-Ausfüllzeit sowie eine Begrenzung der
        Anfragen je Zeitfenster. Dafür wird Ihre IP-Adresse ausschließlich in gehashter (pseudonymisierter) Form für höchstens {retention.rateLimitMinutes}{" "}
        Minuten im Arbeitsspeicher verarbeitet und nicht dauerhaft gespeichert (Art. 6 Abs. 1 lit. f DSGVO). Es werden keine Dienste Dritter
        (z. B. reCAPTCHA) eingesetzt.
      </p>

      <h2 id="speicher">6. Cookies und lokale Speicherung</h2>
      <p>
        Wir setzen keine Cookies zu Analyse- oder Marketingzwecken und binden keine Inhalte Dritter ein. Schriftarten werden von unserem eigenen
        Server geladen. Für den Energie-Check werden Formulareingaben (ohne Dateien) vorübergehend im Sitzungsspeicher Ihres Browsers abgelegt,
        damit Eingaben beim Zurückblättern erhalten bleiben (§ 25 Abs. 2 Nr. 2 TDDDG). Sie werden nach dem Absenden bzw. beim Schließen des Tabs
        gelöscht.
      </p>

      <h2 id="rechte">7. Ihre Rechte</h2>
      <p>Sie haben das Recht auf</p>
      <ul>
        <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>
        <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit wir Daten auf Grundlage berechtigter Interessen verarbeiten, können Sie aus
        Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen.
      </p>
      <p>
        Zur Ausübung Ihrer Rechte genügt eine Nachricht an <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>

      <h2 id="beschwerde">8. Beschwerderecht</h2>
      <p>
        Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Zuständig für uns ist die Landesbeauftragte für Datenschutz und
        Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf.
      </p>

      <h2 id="automatisiert">9. Keine automatisierte Entscheidungsfindung</h2>
      <p>Eine automatisierte Entscheidungsfindung einschließlich Profiling nach Art. 22 DSGVO findet nicht statt.</p>
      <ReviewNote>Gesamte Datenschutzerklärung vor Livegang anwaltlich bzw. durch Datenschutzfachkraft prüfen lassen.</ReviewNote>
    </LegalPage>
  );
}
