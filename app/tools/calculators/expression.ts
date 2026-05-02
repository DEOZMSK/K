import type { ExpressionInput, ExpressionResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit } from "./shared";
import { expression_meaning } from "./meanings";

export function calculateExpression(input: ExpressionInput): ExpressionResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };
  const value = reduceToDigit(parsed.day + parsed.month);
  const meaning = expression_meaning[value];
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
