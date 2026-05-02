import type { AhamkaraInput, AhamkaraResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit, sumDigits } from "./shared";

export function calculateAhamkara(input: AhamkaraInput): AhamkaraResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  return { valid: true, value: reduceToDigit(sumDigits(parsed.day)) };
}
