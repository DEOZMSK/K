export type ParsedBirthDate = {
  day: number;
  month: number;
  year: number;
  ddmmyyyy: string;
};

export function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((acc, d) => acc + Number(d), 0);
}

export function reduceToDigit(n: number): number {
  let value = Math.abs(n);
  while (value > 9) value = sumDigits(value);
  return value;
}

export function parseBirthDate(input: string): ParsedBirthDate | null {
  const v = input.trim();
  let day: number;
  let month: number;
  let year: number;

  if (/^\d{8}$/.test(v)) {
    day = Number(v.slice(0, 2));
    month = Number(v.slice(2, 4));
    year = Number(v.slice(4, 8));
  } else {
    const m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(v);
    if (!m) return null;
    day = Number(m[1]);
    month = Number(m[2]);
    year = Number(m[3]);
  }

  const dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() + 1 !== month || dt.getUTCDate() !== day) return null;

  return {
    day,
    month,
    year,
    ddmmyyyy: `${String(day).padStart(2, "0")}${String(month).padStart(2, "0")}${String(year).padStart(4, "0")}`,
  };
}

export function parseIsoBirthDate(input: string): ParsedBirthDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (!m) return null;
  return parseBirthDate(`${m[3]}.${m[2]}.${m[1]}`);
}
