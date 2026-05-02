import type { VyavadanaInput, VyavadanaResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";

export function calculateVyavadana(input: VyavadanaInput): VyavadanaResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  return { valid: true, value: reduceToDigit(Math.abs(parsed.day - 22)) };
}
