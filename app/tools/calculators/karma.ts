import type { KarmaInput, KarmaResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";

export function calculateKarma(input: KarmaInput): KarmaResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите дату рождения в формате ДД.ММ.ГГГГ, ДД/ММ/ГГГГ, ДД-ММ-ГГГГ или DDMMYYYY." };
  return { valid: true, value: reduceToDigit(parsed.day + parsed.month + parsed.year) };
}
