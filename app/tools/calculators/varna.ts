import type { VarnaInput, VarnaResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit, sumDigits } from "./shared";

const MAP: Record<number, "Кшатрий" | "Брахман" | "Вайшья" | "Шудра"> = {
  1: "Кшатрий",
  9: "Кшатрий",
  3: "Брахман",
  6: "Брахман",
  2: "Вайшья",
  5: "Вайшья",
  4: "Шудра",
  7: "Шудра",
  8: "Шудра",
};

export function calculateVarna(input: VarnaInput): VarnaResult {
  const parsed = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!parsed) return { valid: false, warning: "Укажите корректную дату рождения." };

  const dayDigit = reduceToDigit(sumDigits(parsed.day));
  const monthDigit = parsed.month >= 10 ? reduceToDigit(sumDigits(parsed.month)) : parsed.month;
  const yearDigit = reduceToDigit(sumDigits(parsed.year));
  const fateDigit = reduceToDigit(parsed.ddmmyyyy.split("").reduce((a, c) => a + Number(c), 0));

  const totals = { Кшатрий: 0, Брахман: 0, Вайшья: 0, Шудра: 0 };
  totals[MAP[dayDigit]] += 40;
  totals[MAP[monthDigit]] += 10;
  totals[MAP[yearDigit]] += 10;
  totals[MAP[fateDigit]] += 40;

  return { valid: true, value: `${totals.Кшатрий}/${totals.Брахман}/${totals.Вайшья}/${totals.Шудра}` };
}
