import type { Tariff } from "./calculate";

/**
 * Schnittstelle für echte Tarifdaten (z. B. API eines Vergleichsdienstes oder
 * gepflegte Angebotsliste). Solange kein Anbieter angebunden ist, arbeitet die
 * Website im Modus „Individuelles Angebot anfordern“.
 */
export interface TariffQuery {
  energy: "strom" | "gas";
  customerType: "gewerbe" | "privat";
  postalCode: string;
  consumptionKwh: number;
}

export interface TariffProvider {
  readonly id: string;
  readonly available: boolean;
  findTariffs(query: TariffQuery): Promise<Tariff[]>;
}

/** Standard: keine Tarifdaten → keine Preise anzeigen. */
export const noTariffProvider: TariffProvider = {
  id: "none",
  available: false,
  async findTariffs() {
    return [];
  },
};

export function getTariffProvider(): TariffProvider {
  // Weitere Provider erst nach vertraglicher Klärung der Datennutzung registrieren.
  return noTariffProvider;
}
