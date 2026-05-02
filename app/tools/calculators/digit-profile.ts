import type { DigitProfileInput, DigitProfileResult } from "../types";

const sumDigits = (value: string) =>
  value
    .replace(/\D/g, "")
    .split("")
    .reduce((acc, ch) => acc + Number(ch), 0);

const reduceToDigit = (value: number): number => {
  let current = value;
  while (current > 9) {
    current = String(current)
      .split("")
      .reduce((acc, ch) => acc + Number(ch), 0);
  }
  return current;
};

export function calculateDigitProfile(input: DigitProfileInput): DigitProfileResult {
  if (!input.birthDate) {
    return { valid: false, warning: "Укажите дату рождения." };
  }

  const parsed = new Date(input.birthDate);
  if (Number.isNaN(parsed.getTime())) {
    return { valid: false, warning: "Некорректная дата." };
  }

  const lifePath = reduceToDigit(sumDigits(input.birthDate));
  const expression = reduceToDigit(parsed.getDate() + parsed.getMonth() + 1 + parsed.getFullYear());

  return {
    valid: true,
    lifePath,
    expression,
  };
}
