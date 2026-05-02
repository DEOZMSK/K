import type { PeriodMode, PeriodRow, PeriodsInput, PeriodsResult } from "../types";

const WEEKDAY_MAP = [2, 3, 4, 5, 6, 7, 8] as const;

function sumDigits(value: number): number {
  return String(Math.abs(value))
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);
}

function digitalRoot(value: number): number {
  let n = Math.abs(value);
  while (n > 9) n = sumDigits(n);
  return n === 0 ? 9 : n;
}

function parseBirthDate(birthDate: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) return null;
  return dt;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function birthdayForYear(birth: Date, targetYear: number): Date {
  const m = birth.getUTCMonth();
  const d = birth.getUTCDate();
  if (m === 1 && d === 29 && !isLeapYear(targetYear)) return new Date(Date.UTC(targetYear, 2, 1));
  return new Date(Date.UTC(targetYear, m, d));
}

function resolveRange(mode: PeriodMode, currentYear: number): number[] {
  if (mode === "-10") return Array.from({ length: 10 }, (_, i) => currentYear - 10 + i);
  if (mode === "+10") return Array.from({ length: 10 }, (_, i) => currentYear + i);
  return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
}

function calcWeekdayValue(date: Date): string {
  const dow = date.getUTCDay();
  const mapped = WEEKDAY_MAP[dow === 0 ? 6 : dow - 1];
  return String(mapped);
}

function calcMain(weekday: string, yearSuffix: string, expression: number): string {
  return String(digitalRoot(Number(weekday) + Number(yearSuffix) + expression));
}

function calcBackground(destiny: number, year: number): string {
  return String(digitalRoot(destiny + digitalRoot(year)));
}

export function calculatePeriods(input: PeriodsInput): PeriodsResult {
  const birth = parseBirthDate(input.birthDate);
  if (!birth) return { valid: false, warning: "Укажите корректную дату рождения в формате YYYY-MM-DD.", rows: [] };

  const currentYear = Number.isInteger(input.currentYear) ? Number(input.currentYear) : new Date().getUTCFullYear();
  const years = resolveRange(input.mode, currentYear);
  const expression = digitalRoot(birth.getUTCDate() + (birth.getUTCMonth() + 1) + birth.getUTCFullYear());
  const destiny = digitalRoot(sumDigits(birth.getUTCFullYear()) + (birth.getUTCMonth() + 1) + birth.getUTCDate());

  const rows: PeriodRow[] = years.map((year) => {
    const birthday = birthdayForYear(birth, year);
    const weekday = calcWeekdayValue(birthday);
    const yearSuffix = String(year).slice(-2);

    return {
      year,
      marker: year === currentYear ? "●" : "",
      weekday,
      yearSuffix,
      main: calcMain(weekday, yearSuffix, expression),
      background: calcBackground(destiny, year),
    };
  });

  return {
    valid: true,
    rangeLabel: `${years[0]}–${years[years.length - 1]}`,
    rows,
  };
}
