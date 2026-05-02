import type { MonthsInput, MonthsResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";

export function calculateMonths(input: MonthsInput): MonthsResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения.", headers: [], expressionRow: [], karmaRow: [] };

  const expressionSimple = reduceToDigit(parsed.day + parsed.month);
  const karmaSimple = reduceToDigit(parsed.day + parsed.month + parsed.year);
  // Семантика как в bot.py/render_months_text:
  // 1..12 по колонкам, затем строки "экспрессия" и "карма" для каждого месяца.
  const headers = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const expressionRow = headers.map((month) => String(reduceToDigit(Number(month) + expressionSimple)));
  const karmaRow = headers.map((month) => String(reduceToDigit(Number(month) + karmaSimple)));
  return { valid: true, headers, expressionRow, karmaRow };
}
