import type { AhamkaraInput, AhamkaraResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit, sumDigits } from "./shared";
import { ahamkara_meaning } from "./meanings";

export function calculateAhamkara(input: AhamkaraInput): AhamkaraResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  const value = reduceToDigit(sumDigits(parsed.day));
  const meaning = ahamkara_meaning[value];
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
