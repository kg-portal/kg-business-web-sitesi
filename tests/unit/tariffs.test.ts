import { describe, expect, it } from "vitest";
import { breakEvenConsumption, calculateAnnualCost, compareTariffs, type Tariff } from "@/lib/tariffs/calculate";
import { getTariffProvider } from "@/lib/tariffs/provider";

describe("calculateAnnualCost", () => {
  it("berechnet Verbrauchs-, Grund- und Gesamtkosten", () => {
    const c = calculateAnnualCost({ arbeitspreisCtKwh: 30, grundpreisEurMonat: 10 }, 10_000);
    expect(c.energyCostEur).toBe(3000);
    expect(c.baseCostEur).toBe(120);
    expect(c.recurringEur).toBe(3120);
    expect(c.firstYearEur).toBe(3120);
    expect(c.effectiveCtKwh).toBe(31.2);
  });

  it("zieht Boni nur im ersten Jahr ab", () => {
    const c = calculateAnnualCost({ arbeitspreisCtKwh: 30, grundpreisEurMonat: 10, bonusEur: 200 }, 10_000);
    expect(c.firstYearEur).toBe(2920);
    expect(c.recurringEur).toBe(3120);
  });

  it("lehnt negative oder ungültige Werte ab", () => {
    expect(() => calculateAnnualCost({ arbeitspreisCtKwh: -1, grundpreisEurMonat: 0 }, 1000)).toThrow(RangeError);
    expect(() => calculateAnnualCost({ arbeitspreisCtKwh: Number.NaN, grundpreisEurMonat: 0 }, 1000)).toThrow(RangeError);
  });
});

describe("breakEvenConsumption", () => {
  it("findet den Verbrauch, ab dem der niedrigere Arbeitspreis gewinnt", () => {
    // B: 2 ct günstiger je kWh, aber 15 €/Monat (180 €/Jahr) teurer → 9.000 kWh
    expect(breakEvenConsumption({ arbeitspreisCtKwh: 30, grundpreisEurMonat: 10 }, { arbeitspreisCtKwh: 28, grundpreisEurMonat: 25 })).toBe(9000);
  });
  it("gibt null zurück, wenn kein Schnittpunkt existiert", () => {
    expect(breakEvenConsumption({ arbeitspreisCtKwh: 30, grundpreisEurMonat: 10 }, { arbeitspreisCtKwh: 30, grundpreisEurMonat: 20 })).toBeNull();
    expect(breakEvenConsumption({ arbeitspreisCtKwh: 30, grundpreisEurMonat: 20 }, { arbeitspreisCtKwh: 28, grundpreisEurMonat: 10 })).toBeNull();
  });
});

describe("compareTariffs", () => {
  const base: Omit<Tariff, "id" | "arbeitspreisCtKwh" | "grundpreisEurMonat"> = {
    supplier: "Test",
    name: "Test",
    energy: "strom",
    customerType: "gewerbe",
    laufzeitMonate: 12,
    kuendigungsfristWochen: 4,
    preisgarantie: { art: "eingeschraenkt", monate: 12 },
    brutto: false,
    stand: "2026-10-01",
  };
  it("sortiert nach Folgejahreskosten, damit Boni nicht verzerren", () => {
    const tariffs: Tariff[] = [
      { ...base, id: "a", arbeitspreisCtKwh: 30, grundpreisEurMonat: 10, bonusEur: 500 },
      { ...base, id: "b", arbeitspreisCtKwh: 28, grundpreisEurMonat: 10 },
    ];
    expect(compareTariffs(tariffs, 10_000).map((r) => r.tariff.id)).toEqual(["b", "a"]);
    expect(compareTariffs(tariffs, 10_000, "firstYear").map((r) => r.tariff.id)).toEqual(["a", "b"]);
  });
});

describe("Tarifanbieter", () => {
  it("liefert ohne Anbindung keine Preise (Modus „Individuelles Angebot“)", async () => {
    const p = getTariffProvider();
    expect(p.available).toBe(false);
    expect(await p.findTariffs({ energy: "strom", customerType: "gewerbe", postalCode: "47055", consumptionKwh: 10000 })).toEqual([]);
  });
});
