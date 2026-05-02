import type { DharmaInput, DharmaResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";

export function calculateDharma(input: DharmaInput): DharmaResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  return { valid: true, value: reduceToDigit(parsed.day + parsed.month) };
}
