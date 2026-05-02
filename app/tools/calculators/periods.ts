import type { PeriodMode, PeriodRow, PeriodsInput, PeriodsResult } from "../types";
import { parseBirthDate, parseIsoBirthDate, reduceToDigit, sumDigits } from "./shared";

const WEEKDAY_MAP = [2, 9, 5, 3, 6, 8, 1] as const;

function getCurrentYearInMoscow(): number {
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Moscow", year: "numeric" });
  const yearPart = formatter.formatToParts(new Date()).find((part) => part.type === "year")?.value;
  const parsed = yearPart ? Number(yearPart) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : new Date().getUTCFullYear();
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function birthdayForYear(day: number, month: number, year: number): Date {
  if (day === 29 && month === 2 && !isLeapYear(year)) return new Date(Date.UTC(year, 2, 1));
  return new Date(Date.UTC(year, month - 1, day));
}

function yearsRange(mode: PeriodMode, currentYear: number): number[] {
  if (mode === "+10") return Array.from({ length: 11 }, (_, i) => currentYear + i);
  if (mode === "-10") return Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);
  return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
}

export function calculatePeriods(input: PeriodsInput): PeriodsResult {
  const birth = parseBirthDate(input.birthDate) ?? parseIsoBirthDate(input.birthDate);
  if (!birth) return { valid: false, warning: "Укажите корректную дату рождения.", rows: [] };

  const currentYear = Number.isInteger(input.currentYear) ? Number(input.currentYear) : getCurrentYearInMoscow();
  let years = yearsRange(input.mode, currentYear).filter((y) => y >= birth.year);
  if (years.length === 0) years = [birth.year];

  const expressionNum = reduceToDigit(birth.day + birth.month);
  const destinyNum = reduceToDigit(birth.day + birth.month + birth.year);

  const rows: PeriodRow[] = years.map((year) => {
    const date = birthdayForYear(birth.day, birth.month, year);
    const pyWeekday = (date.getUTCDay() + 6) % 7;
    const weekday = String(WEEKDAY_MAP[pyWeekday]);
    const yearSuffix = String(year).slice(-2);
    const yearValue = Number(yearSuffix);
    const main = String(reduceToDigit(Number(weekday) + yearValue + expressionNum));
    const background = String(reduceToDigit(destinyNum + reduceToDigit(sumDigits(year))));

    return { year, marker: year === currentYear ? "●" : "", weekday, yearSuffix, main, background };
  });

  return { valid: true, rangeLabel: `${years[0]}–${years[years.length - 1]}`, rows };
}
