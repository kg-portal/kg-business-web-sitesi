import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cookie-Hinweis",
  description: "Diese Website verwendet keine Tracking- oder Marketing-Cookies und bindet keine Dienste Dritter ein.",
  path: "/cookie-hinweis",
});

export default function CookieHinweisPage() {
  return (
    <LegalPage title="Cookie-Hinweis" path="/cookie-hinweis" updated="Oktober 2026">
      <h2>Kein Tracking, keine Marketing-Cookies</h2>
      <p>
        Diese Website setzt <strong>keine Cookies</strong> für Analyse-, Marketing- oder Werbezwecke und bindet keine Dienste Dritter ein (keine
        externen Schriftarten, Karten, Videos oder Analyse-Tools). Deshalb zeigen wir Ihnen auch kein Cookie-Banner.
      </p>
      <h2>Technisch erforderliche Speicherung</h2>
      <p>
        Damit Ihre Eingaben im mehrstufigen Energie-Check beim Zurückblättern oder einem versehentlichen Neuladen nicht verloren gehen, speichert
        Ihr Browser die Formulareingaben (ohne hochgeladene Dateien) vorübergehend im <strong>Sitzungsspeicher (sessionStorage)</strong>. Die Daten
        verlassen Ihr Gerät dabei nicht, werden nach dem erfolgreichen Absenden gelöscht und spätestens beim Schließen des Browser-Tabs verworfen.
      </p>
      <p>
        Diese Speicherung ist unbedingt erforderlich, um den von Ihnen ausdrücklich gewünschten Dienst bereitzustellen (§ 25 Abs. 2 Nr. 2 TDDDG).
        Eine Einwilligung ist dafür nicht erforderlich.
      </p>
      <h2>Weitere Informationen</h2>
      <p>
        Ausführliche Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer <Link href="/datenschutz">Datenschutzerklärung</Link>.
      </p>
    </LegalPage>
  );
}
