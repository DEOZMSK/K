import type { DharmaInput, DharmaResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";
import { dharma_meaning } from "./meanings";

export function calculateDharma(input: DharmaInput): DharmaResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  const value = reduceToDigit(parsed.day + parsed.month);
  const meaning = dharma_meaning[value];
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
