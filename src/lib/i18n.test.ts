import { describe, expect, it } from "vitest";
import en from "../locales/en/common.json";
import ta from "../locales/ta/common.json";
import hi from "../locales/hi/common.json";
import { operationsTranslations } from "../locales/operations";

function leafKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([key, child]) => leafKeys(child, prefix ? `${prefix}.${key}` : key));
}

describe("translation resources", () => {
  it("contain every English key in Tamil and Hindi", () => {
    const englishKeys = leafKeys(en).sort();
    expect(leafKeys(ta).sort()).toEqual(englishKeys);
    expect(leafKeys(hi).sort()).toEqual(englishKeys);
  });
  it("contain every operations key in Tamil and Hindi", () => {
    const englishKeys = leafKeys(operationsTranslations.en).sort();
    expect(leafKeys(operationsTranslations.ta).sort()).toEqual(englishKeys);
    expect(leafKeys(operationsTranslations.hi).sort()).toEqual(englishKeys);
  });
});
