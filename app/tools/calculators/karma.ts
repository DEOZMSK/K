import type { KarmaInput, KarmaResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";
import { karma_meaning } from "./meanings";

export function calculateKarma(input: KarmaInput): KarmaResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите дату рождения в формате ДД.ММ.ГГГГ, ДД/ММ/ГГГГ, ДД-ММ-ГГГГ или DDMMYYYY." };
  const value = reduceToDigit(parsed.day + parsed.month + parsed.year);
  const meaning = karma_meaning[value];
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
