import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { company } from "@/content/company";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { isIndexable, siteConfig } from "@/lib/site";
import "./globals.css";

// Selbst gehostete Schrift (SIL OFL) – keine Verbindung zu Google Fonts.
// Eine Familie für Überschriften und Fließtext spart einen Font-Download.
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin-var.woff2",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${company.brandName} – Strom & Gas Energieberatung für Unternehmen`,
    template: `%s | ${company.brandName}`,
  },
  description:
    "KG Business vergleicht Strom- und Gasverträge für Unternehmen und Privathaushalte, erklärt Konditionen verständlich und begleitet den Anbieterwechsel – persönlich aus Duisburg.",
  applicationName: company.brandName,
  formatDetection: { telephone: false, email: false, address: false },
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "32x32" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#081a40",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={jakarta.variable}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileCtaBar />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
