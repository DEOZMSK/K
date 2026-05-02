import type { MonthsInput, MonthsResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";

export function calculateMonths(input: MonthsInput): MonthsResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения.", headers: [], expressionRow: [], karmaRow: [] };

  const expressionSimple = reduceToDigit(parsed.day + parsed.month);
  const karmaSimple = reduceToDigit(parsed.day + parsed.month + parsed.year);
  const headers = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const expressionRow = headers.map((h) => String(reduceToDigit(Number(h) + expressionSimple)));
  const karmaRow = headers.map((h) => String(reduceToDigit(Number(h) + karmaSimple)));
  return { valid: true, headers, expressionRow, karmaRow };
}
