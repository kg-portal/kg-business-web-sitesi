import { describe, expect, it } from "vitest";
import { parseGermanNumber } from "@/lib/format";
import { normalizePhone } from "@/lib/phone";

describe("normalizePhone", () => {
  it.each([
    ["0203 47 96 68 22", "+4920347966822"],
    ["+49 (0) 203 / 4796682", "+492034796682"],
    ["0049 170 1234567", "+491701234567"],
    ["+49-170-1234567", "+491701234567"],
    ["0170.1234567", "+491701234567"],
    ["+43 1 234567", "+431234567"],
  ])("%s → %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "abc", "12345", "203 1234567", "+49 0203 1234567", "0203 123 abc", "+1234"])("lehnt %j ab", (input) => {
    expect(normalizePhone(input)).toBeNull();
  });
});

describe("parseGermanNumber", () => {
  it.each([
    ["12.000", 12000],
    ["31,5", 31.5],
    ["31.5", 31.5],
    ["1.234.567,89", 1234567.89],
    ["  2500 ", 2500],
  ])("%s → %s", (input, expected) => {
    expect(parseGermanNumber(input)).toBe(expected);
  });

  it.each(["", "abc", "1,2,3", "-5", "12.34.5"])("lehnt %j ab", (input) => {
    expect(parseGermanNumber(input)).toBeNull();
  });
});
