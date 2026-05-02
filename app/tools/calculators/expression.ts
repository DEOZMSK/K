import type { ExpressionInput, ExpressionResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";

export function calculateExpression(input: ExpressionInput): ExpressionResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  return { valid: true, value: reduceToDigit(parsed.day + parsed.month) };
}
