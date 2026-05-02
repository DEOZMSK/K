import type { VyavadanaInput, VyavadanaResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";
import { vyavadhana_meaning } from "./meanings";

export function calculateVyavadana(input: VyavadanaInput): VyavadanaResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  const value = reduceToDigit(Math.abs(parsed.day - 22));
  const meaning = vyavadhana_meaning[value];
  return {
    valid: true,
    value,
    meaning: meaning
      ? {
          text: meaning.text,
          url: meaning.url,
          linkHtml: `<a href="${meaning.url}" target="_blank" rel="noreferrer">${meaning.text}</a>`,
        }
      : undefined,
  };
}
