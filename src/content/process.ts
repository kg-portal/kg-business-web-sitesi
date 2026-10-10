import type { IconName } from "@/components/ui/Icon";

export const processSteps: { title: string; text: string; detail: string; icon: IconName }[] = [
  {
    title: "Bedarf mitteilen",
    text: "Energie-Check ausfüllen, Rechnung hochladen oder einfach anrufen.",
    detail: "Kundentyp, Energieart, Verbrauch und Kontaktdaten genügen für den Start. Eine aktuelle Jahresrechnung beschleunigt die Prüfung – ist aber keine Pflicht.",
    icon: "clipboard",
  },
  {
    title: "Verbrauch und Vertrag prüfen",
    text: "Wir werten Preise, Laufzeit und Kündigungsfrist Ihres aktuellen Vertrags aus.",
    detail: "Arbeitspreis, Grundpreis, Vertragsende und Preisgarantie werden erfasst. Bei leistungsgemessenen Zählern beziehen wir den Lastgang ein.",
    icon: "fileSearch",
  },
  {
    title: "Individuelles Angebot erhalten",
    text: "Sie bekommen passende Angebote – verständlich gegenübergestellt.",
    detail: "Wir holen Angebote für Ihre Lieferstelle ein und erläutern die Unterschiede: nicht nur beim Preis, sondern auch bei Laufzeit, Preisgarantie und Kündigungsbedingungen.",
    icon: "scale",
  },
  {
    title: "Entscheidung und Wechsel begleiten",
    text: "Sie entscheiden. Wir begleiten den Anbieterwechsel bis zur Bestätigung.",
    detail: "Es besteht kein Abschlusszwang. Wenn Sie sich für ein Angebot entscheiden, unterstützen wir bei Unterlagen, Kündigung und Wechsel – ohne Unterbrechung der Versorgung.",
    icon: "handshake",
  },
];
