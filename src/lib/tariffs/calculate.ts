/**
 * Tarif-Berechnungen (rein funktional, ohne Seiteneffekte).
 * Wird vom Jahreskosten-Rechner (Nutzereingaben) und – sobald echte Tarifdaten
 * angebunden sind – vom Tarifvergleich verwendet. Die Website enthält bewusst
 * KEINE Beispiel- oder Fantasiepreise.
 */

export interface TariffTerms {
  /** Arbeitspreis in Cent pro kWh */
  arbeitspreisCtKwh: number;
  /** Grundpreis in Euro pro Monat */
  grundpreisEurMonat: number;
  /** Einmaliger Bonus in Euro (nur im ersten Vertragsjahr) */
  bonusEur?: number;
}

export interface Tariff extends TariffTerms {
  id: string;
  supplier: string;
  name: string;
  energy: "strom" | "gas";
  customerType: "gewerbe" | "privat";
  laufzeitMonate: number;
  kuendigungsfristWochen: number;
  vertragsbeginnFrueheste?: string;
  preisgarantie: { art: "umfassend" | "eingeschraenkt" | "stark-eingeschraenkt" | "keine"; monate: number };
  /** Preise inkl. USt.? (Privatkunden: zwingend brutto, PAngV) */
  brutto: boolean;
  /** Datum der Preisinformation (ISO) */
  stand: string;
}

export interface CostBreakdown {
  energyCostEur: number;
  baseCostEur: number;
  bonusEur: number;
  /** Kosten im ersten Jahr (inkl. Bonus) */
  firstYearEur: number;
  /** Kosten ohne Bonus (Folgejahre bei gleichen Preisen) */
  recurringEur: number;
  /** Effektiver Durchschnittspreis in ct/kWh (ohne Bonus) */
  effectiveCtKwh: number;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function assertValidTerms(terms: TariffTerms, consumptionKwh: number): void {
  const values = [terms.arbeitspreisCtKwh, terms.grundpreisEurMonat, terms.bonusEur ?? 0, consumptionKwh];
  if (values.some((v) => !Number.isFinite(v) || v < 0)) {
    throw new RangeError("Ungültige Tarif- oder Verbrauchswerte");
  }
}

/** Voraussichtliche Jahreskosten für einen Verbrauch. */
export function calculateAnnualCost(terms: TariffTerms, consumptionKwh: number): CostBreakdown {
  assertValidTerms(terms, consumptionKwh);
  const energyCostEur = (terms.arbeitspreisCtKwh * consumptionKwh) / 100;
  const baseCostEur = terms.grundpreisEurMonat * 12;
  const bonusEur = terms.bonusEur ?? 0;
  const recurringEur = energyCostEur + baseCostEur;
  const firstYearEur = Math.max(0, recurringEur - bonusEur);
  return {
    energyCostEur: round2(energyCostEur),
    baseCostEur: round2(baseCostEur),
    bonusEur: round2(bonusEur),
    firstYearEur: round2(firstYearEur),
    recurringEur: round2(recurringEur),
    effectiveCtKwh: consumptionKwh > 0 ? round2((recurringEur / consumptionKwh) * 100) : 0,
  };
}

/**
 * Verbrauch, ab dem Tarif B (niedrigerer Arbeitspreis) günstiger ist als Tarif A.
 * Gibt null zurück, wenn kein Schnittpunkt existiert.
 */
export function breakEvenConsumption(a: TariffTerms, b: TariffTerms): number | null {
  const deltaArbeitEurKwh = (a.arbeitspreisCtKwh - b.arbeitspreisCtKwh) / 100;
  const deltaGrundEurJahr = (b.grundpreisEurMonat - a.grundpreisEurMonat) * 12;
  if (deltaArbeitEurKwh === 0) return null;
  const kwh = deltaGrundEurJahr / deltaArbeitEurKwh;
  return kwh > 0 ? Math.round(kwh) : null;
}

export interface RankedTariff {
  tariff: Tariff;
  cost: CostBreakdown;
}

/**
 * Sortiert Tarife nach Kosten. Standardmäßig nach Folgejahreskosten (ohne Bonus),
 * damit Boni das Ranking nicht verzerren.
 */
export function compareTariffs(
  tariffs: Tariff[],
  consumptionKwh: number,
  sortBy: "recurring" | "firstYear" = "recurring",
): RankedTariff[] {
  return tariffs
    .map((tariff) => ({ tariff, cost: calculateAnnualCost(tariff, consumptionKwh) }))
    .sort((x, y) => {
      const diff = sortBy === "recurring" ? x.cost.recurringEur - y.cost.recurringEur : x.cost.firstYearEur - y.cost.firstYearEur;
      return diff !== 0 ? diff : x.tariff.laufzeitMonate - y.tariff.laufzeitMonate;
    });
}
